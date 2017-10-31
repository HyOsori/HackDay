import os

import tornado.web
import osorihack.view

APP_NAME = "Osori_HackDay"


class OsoriHack(tornado.web.Application):
    def __init__(self):
        self.handler = [
            (r"/", osorihack.view.IndexHandler),
            (r"/home", osorihack.view.HomeHandler),
            (r"/login", osorihack.view.LoginHandler),

            (r"/repo/([^/]+)/([^/]+)", osorihack.view.SearchRepositoryHandler),
            (r"/repo", osorihack.view.SearchRepositoryHandler),
        ]

        self.settings = dict(
            title=APP_NAME,
            template_path=os.path.join(os.getcwd(), "templates"),
            static_path=os.path.join(os.getcwd(), "static"),
            cookie_secret="osorihackday",
            debug=True
        )

        super(OsoriHack, self).__init__(self.handler, **self.settings)

app = OsoriHack()

if __name__ == "__main__":
    pass
