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
    return render_template('index.html', **data)


if __name__ == '__main__':
    app.run()
