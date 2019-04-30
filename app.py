from flask import Flask, render_template
import json

app = Flask(__name__)


@app.route('/')
def index():
    data = json.loads(
        open(
            "lang/en.lang"
        ).read()
    )

    return render_template('home.html', lang=data)


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5005)
