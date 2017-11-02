import os
import tornado.web
from osorihack.model.repository import ManagedInfo

APP_NAME = "Osori_HackDay"


class OsoriHack(tornado.web.Application):
    def __init__(self):
        import osorihack.view

        self.handler = [
            (r"/", osorihack.view.IndexHandler),
            (r"/home", osorihack.view.HomeHandler),
            (r"/login", osorihack.view.LoginHandler),

            (r"/repo/([^/]+)/([^/]+)", osorihack.view.SearchRepositoryHandler),
            (r"/repo", osorihack.view.SearchRepositoryHandler),
            (r"/awesome", osorihack.view.AwesomeResultHandler),

            (r"/chat", osorihack.view.ChatHandler),
        ]

        self.settings = dict(
            title=APP_NAME,
            template_path=os.path.join(os.getcwd(), "templates"),
            static_path=os.path.join(os.getcwd(), "static"),
            cookie_secret="osorihackday",
            debug=True,
        )

        # self.managed_repo
        self.managed_info = list()
        with open("management.txt", "r") as f:
            for line in f.buffer:
                info = line.decode()
                info = info.split()
                self.managed_info.append(ManagedInfo(info[0], info[1]))

        super(OsoriHack, self).__init__(self.handler, **self.settings)

app = OsoriHack()

if __name__ == "__main__":
    pass

