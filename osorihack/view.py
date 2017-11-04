import tornado.web
import tornado.gen
import tornado.websocket
import json

import time

import osorihack.githubhelper

from osorihack.model.repository import Repository, Contributor, Notice

USER_COOKIE = "happyhackday"
EXPIRED_TIME = 60 * 10

cached_data = {"time": 0, "repo_data": None, "awesome_data": None, "managed_info": None}

TYPE_MESSAGE = "message"
TYPE_NOTICE = "notice"


class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        user_name = self.get_secure_cookie(USER_COOKIE)
        return user_name


class IndexHandler(BaseHandler):
    def get(self):
        user = self.get_current_user()
        if user is None:
            self.redirect("/login")
        else:
            self.redirect("/home")


class ErrorHandler(BaseHandler):
    def get(self, *args, **kwargs):
        self.render("error.html")


class AdminHandler(BaseHandler):
    def get(self, *args, **kwargs):
        self.render("admin.html")

    def post(self, *args, **kwargs):
        try:
            message = json.loads(self.request.body.decode())
            if self.settings["auth_key"] == message["auth"]:
                notice = Notice(message["title"], message["message"])
                self.application.notice_list.append(notice)
                for chatter in chat_pool:
                    chatter.write_message(json.dumps(Notice.serializable(notice)).encode())
                # success case
                self.write(json.dumps({"response": "success"}).encode())
                return
        except Exception as e:
            pass
        # failure case
        self.write(json.dumps({"response": "failure"}).encode())


class LoginHandler(BaseHandler):
    def get(self):
        user = self.get_current_user()
        if user is None:
            self.render("login.html")
        else:
            self.redirect("/home")

    def post(self):
        user_name = self.get_argument("user_name")

        if user_name is not None and len(user_name) != 0:
            self.set_secure_cookie(USER_COOKIE, user_name)
            self.redirect("/home")
        else:
            self.redirect("/error")


class HomeHandler(BaseHandler):
    def get(self):
        user = self.get_current_user()
        if user is not None:
            self.render("home.html")
        else:
            self.redirect("/login")


class AwesomeResultHandler(BaseHandler):
    @tornado.gen.coroutine
    def get(self, *args, **kwargs):
        cached_time = cached_data["time"]
        if time.time() - cached_time < EXPIRED_TIME or refreshing:
            self.write(cached_data["awesome_data"])
            return

        yield refresh_information(self.application.managed_info)
        self.write(cached_data["awesome_data"])


class SearchRepositoryHandler(BaseHandler):
    @tornado.gen.coroutine
    def get(self, *args, **kwargs):
        cached_time = cached_data["time"]
        if time.time() - cached_time < EXPIRED_TIME or refreshing:
            self.write(cached_data["repo_data"])
            return

        yield refresh_information(self.application.managed_info)
        self.write(cached_data["repo_data"])


refreshing = False


@tornado.gen.coroutine
def refresh_information(managed_repo):
    global refreshing

    refreshing = True
    repo_group = list()

    best_repository = None
    best_contributor = None

    for managed_info in managed_repo:
        repo_response = yield osorihack.githubhelper.get_repository(managed_info.owner, managed_info.repo_name)
        repo_info = json.loads(repo_response.body.decode())
        repo_size = repo_info["size"]
        repo_star = repo_info["stargazers_count"]

        contributor_response = yield osorihack.githubhelper.get_contributors(managed_info.owner, managed_info.repo_name)
        total_commit = 0

        contributor_group = list()
        # list of contributors
        contributor_info_list = json.loads(contributor_response.body.decode())
        for contributor_info in contributor_info_list:
            contributor = Contributor(
                contributor_info["login"],
                contributor_info["contributions"],
                contributor_info["html_url"]
            )
            contributor_group.append(contributor)

            if best_contributor is None or best_contributor.commit < contributor.commit:
                best_contributor = contributor

            total_commit += contributor.commit

        repository = Repository(managed_info.repo_name,
                                managed_info.owner,
                                contributor_group,
                                "https://github.com/%s/%s" % (managed_info.owner, managed_info.repo_name)
                                )
        repository.repo_size = repo_size
        repository.star = repo_star
        repository.commit = total_commit
        repo_group.append(repository)

        if best_repository is None or best_repository.commit < repository.commit:
            best_repository = repository

    data_group = list()
    for repo in repo_group:
        data_group.append(Repository.json_serializable(repo))
    repo_data = json.dumps(data_group)

    awesome_data = dict()
    awesome_data["best_commit_repo"] = Repository.json_serializable(best_repository)
    awesome_data["best_commit_contributor"] = best_contributor.__dict__
    awesome_data = json.dumps(awesome_data)

    cached_data["time"] = time.time()
    cached_data["awesome_data"] = awesome_data
    cached_data["repo_data"] = repo_data
    cached_data["managed_info"] = repo_group

    refreshing = False

chat_pool = list()


class ConnHandler(tornado.websocket.WebSocketHandler):
    def open(self, *args, **kwargs):
        chat_pool.append(self)
        for notice in self.application.notice_list:
            self.write_message(Notice.serializable(notice))

    def on_message(self, message):
        try:
            parsed_message = json.loads(message)
            if parsed_message["type"] == TYPE_MESSAGE:
                for chatter in chat_pool:
                    chatter.write_message(message)
        except Exception:
            pass

    def on_close(self):
        chat_pool.remove(self)


