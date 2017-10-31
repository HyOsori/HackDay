from tornado.ioloop import IOLoop
from osorihack import app

if __name__ == "__main__":
    app.listen(9000)
    IOLoop.current().start()
