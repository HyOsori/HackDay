import functools

from tornado.ioloop import IOLoop
from osorihack import app
from osorihack.view import refresh_information

if __name__ == "__main__":
    print("Start osori hack-day")
    app.listen(80)
    print("ready for initialize data")
    # init_data_func = functools.partial(refresh_information, app.managed_info)
    # IOLoop.current().run_sync(init_data_func)
    print("initialize data is done")
    print("Start Server")
    IOLoop.current().start()
