from tornado.ioloop import IOLoop
from tornado.options import define, options, parse_command_line
from osorihack import app

define("port", default=5000, help="run on the given port", type=int)


def run():
    parse_command_line()
    app.listen(options.port)
    IOLoop.instance().start()

if __name__ == "__main__":
    run()
