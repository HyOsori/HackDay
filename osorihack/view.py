import tornado.web
import tornado.gen

import osorihack.githubhelper

USER_COOKIE = "happyhackday"


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


class AwesomeResultHandler(BaseHandler):
    pass


class SearchRepositoryHandler(BaseHandler):

    @tornado.gen.coroutine
    def get(self, *args, **kwargs):
        if args is None:
            # todo: write all result of data
            for owner, repo_name in list():
                response = yield osorihack.githubhelper.get_contributors(owner, repo_name)

            pass
        else:
            owner = args[0]
            repo_name = args[1]

            response = yield osorihack.githubhelper.get_contributors(owner, repo_name)
            self.write(response.body)
            # todo: write only one data of repository
            pass
