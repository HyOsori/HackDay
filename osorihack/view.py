import tornado.web
import tornado.gen
import tornado.websocket
import json

import time

import osorihack.githubhelper

from osorihack.model.repository import ManagedInfo, Repository, Contributor

USER_COOKIE = "happyhackday"
EXPIRED_TIME = 5 * 60

cached_data = {"time": 0, "repo_data": None, "awesome_data": None, "managed_info": None}

managed_repo = list()

managed_repo.append(ManagedInfo("bees1114", "Calenderation"))
managed_repo.append(ManagedInfo("junsulime", "osori-hackday-helper"))
managed_repo.append(ManagedInfo("seubseub", "OsoriHackDayARKIT"))


class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        # TODO: cookie key value setting is needed
        user_name = self.get_secure_cookie(USER_COOKIE)
        return user_name


class IndexHandler(BaseHandler):
    def get(self):
        user = self.get_current_user()
        if user is None:
            self.redirect("/login")
        else:
            self.redirect("/home")


class LoginHandler(BaseHandler):
    def get(self):
        user = self.get_current_user()
        if user is None:
            self.render("login.html")
        else:
            self.redirect("/home")

    def post(self):
        user_name = self.get_argument("user_name")

        if user_name is not None:
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

# TODO: caching search result and .. if data is not expired, resend it
class AwesomeResultHandler(BaseHandler):
    def get(self, *args, **kwargs):
        cached_time = cached_data["time"]
        if time.time() - cached_time < EXPIRED_TIME:
            self.write(cached_data["repo_data"])
            return

        yield refresh_information(self.application.managed_info)
        self.write(cached_data["awesome_data"])


class SearchRepositoryHandler(BaseHandler):
    @tornado.gen.coroutine
    def get(self, *args, **kwargs):
        cached_time = cached_data["time"]
        if time.time() - cached_time < EXPIRED_TIME:
            self.write(cached_data["repo_data"])
            return

        yield refresh_information(self.application.managed_info)
        self.write(cached_data["repo_data"])


@tornado.gen.coroutine
def refresh_information(managed_repo):
    repo_group = list()
    for managed_info in managed_repo:
        repo_response = yield osorihack.githubhelper.get_repository(managed_info.owner, managed_info.repo_name)
        repo_info = json.loads(repo_response.body.decode())
        repo_size = repo_info["size"]
        repo_star = repo_info["stargazers_count"]

        contributor_response = yield osorihack.githubhelper.get_contributors(managed_info.owner, managed_info.repo_name)

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

        repository = Repository(managed_info.repo_name,
                                managed_info.owner,
                                contributor_group,
                                "https://github.com/%s/%s" % (managed_info.owner, managed_info.repo_name)
                                )
        repository.repo_size = repo_size
        repository.star = repo_star
        repo_group.append(repository)

    data_group = list()
    for repo in repo_group:
        data_group.append(Repository.json_serializable(repo))
    repo_data = json.dumps(data_group)
    # awesome_data =

    cached_data["time"] = time.time()
    cached_data["repo_data"] = repo_data
    cached_data["managed_info"] = repo_group


chat_pool = list()


class ChatHandler(tornado.websocket.WebSocketHandler):
    def open(self, *args, **kwargs):
        chat_pool.append(self)

    def on_message(self, message):
        for chatter in chat_pool:
            chatter.write_message(message)

    def on_close(self):
        chat_pool.remove(self)

