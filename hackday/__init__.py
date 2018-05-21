import os
import tornado.web

from hackday.view import ApiHandler, DefaultHandler


class HackDay(tornado.web.Application):
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

        super(HackDay, self).__init__(self.handler, **self.settings)

app = HackDay()

if __name__ == "__main__":
    pass

