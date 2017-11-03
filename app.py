import functools

from tornado.ioloop import IOLoop
from tornado.options import define, options, parse_command_line
from osorihack import app
from osorihack.view import refresh_information

define("port", default=5000, help="run on the given port", type=int)


def run():
    parse_command_line()

    cache_initialize_func = functools.partial(refresh_information, app.managed_info)
    IOLoop.instance().run_sync(cache_initialize_func)

    app.listen(options.port)
    IOLoop.instance().start()

if __name__ == "__main__":
    run()
