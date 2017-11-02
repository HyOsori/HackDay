import functools
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.options import define, options, parse_command_line
from osorihack import app
from osorihack.view import refresh_information

define("port", default=5000, help="run on the given port", type=int)


def run():
    parse_command_line()
    app.listen(options.port)
    IOLoop.instance().start()

if __name__ == "__main__":
    run()
