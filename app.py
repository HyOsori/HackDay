import tornado.ioloop
import hackday


PORT = 8000


def run():
    tornado.ioloop.IOLoop.instance().start()


def dev_prepare():
    import re
    import os
    import hackday

    source_path = os.path.join(os.getcwd(), 'dist/index.html')
    target_path = os.path.join(os.getcwd(), 'dist/index_dev.html')

    js_list = ['runtime.js', 'polyfills.js', 'styles.js', 'vendor.js', 'main.js']
    with open(source_path, 'r') as f:
        dev_file = open(target_path, '+w')

        while True:
            line = f.readline()
            if not line:
                break

            for j in js_list:
                line = line.replace(j, '{{ static_url(\"%s\") }}' % j)
            dev_file.write(line)
                
        dev_file.close()
    hackday.app.listen(PORT)

if __name__ == "__main__":    
    dev_prepare()
    run()
