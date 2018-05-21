import os
import tornado.web

from engine.view import ApiHandler, DefaultHandler


class Engine(tornado.web.Application):
    def __init__(self):
        self.handler = [
            (r"/api", ApiHandler),
	    ]

        self.settings = dict(
            title="fill_it",
            cookie_secret="fill_it",
            github_token="fill_it",
            debug=True,

            # for develop server
            template_path=os.path.join(os.getcwd(), "dist"),
            static_path=os.path.join(os.getcwd(), "dist"),
            default_handler_class=DefaultHandler,
        )

        super(Engine, self).__init__(self.handler, **self.settings)
app = Engine()

if __name__ == "__main__":
    pass

