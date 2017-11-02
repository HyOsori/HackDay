import functools
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from osorihack import app
from osorihack.view import refresh_information

if __name__ == "__main__":
    print("Start osori hack-day")
    http_server = HTTPServer(app)
    http_server.listen(5000, "0.0.0.0")
    print("ready for initialize data")
    # init_data_func = functools.partial(refresh_information, app.managed_info)
    # IOLoop.current().run_sync(init_data_func)
    print("initialize data is done")
    print("Start Server")
    IOLoop.current().start()
