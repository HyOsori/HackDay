import tornado.web
import tornado.gen
import json

import time

import osorihack.githubhelper

from osorihack.model.repository import ManagedInfo, Repository, Contributor

USER_COOKIE = "happyhackday"
EXPIRED_TIME = 5 * 60

cached_data = {"time": 0, "data": ""}

managed_repo = list()

managed_repo.append(ManagedInfo("hyosori", "osori-android"))
managed_repo.append(ManagedInfo("junsulime", "osori-hackday-helper"))


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
    pass

# TODO: caching search result and .. if data is not expired, resend it
class SearchRepositoryHandler(BaseHandler):

    @tornado.gen.coroutine
    def get(self, *args, **kwargs):
        if len(args) == 0:
            cached_time = cached_data["time"]
            if time.time() - cached_data["time"] < EXPIRED_TIME:
                print("cached data is used")
                self.write(cached_data["data"])
                return 

            repo_group = list()
            for managed_info in managed_repo:
                response = yield osorihack.githubhelper.get_contributors(managed_info.owner, managed_info.repo_name)

                contributor_group = list()
                # list of contributors
                repo_info = json.loads(response.body.decode())
                for contributor_info in repo_info:
                    contributor = Contributor(contributor_info["login"], contributor_info["contributions"])
                    contributor_group.append(contributor)

                repository = Repository(managed_info.repo_name, managed_info.owner, contributor_group)
                repo_group.append(Repository.json_serializable(repository))

            data = json.dumps(repo_group)
            cached_data["time"] = time.time()
            cached_data["data"] = data
            self.write(data)

        # will not used ...
        else:
            owner = args[0]
            repo_name = args[1]

            response = yield osorihack.githubhelper.get_contributors(owner, repo_name)
            self.write(response.body)
            # todo: write only one data of repository
            pass


if __name__ == "__main__":
    print(type(cached_data["time"]))
    print(cached_data["time"])