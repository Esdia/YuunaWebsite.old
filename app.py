from flask import Flask, render_template, make_response, request
import json

app = Flask(__name__)


def get_language():
    lang = request.cookies.get("language")
    if lang not in ["en", "fr"]:
        lang = "en"

    return json.load(
        open(
            "lang/{}.lang".format(
                lang
            )
        )
    )


@app.route('/')
def index():
    res = make_response(render_template("home.html", lang=get_language()))
    res.set_cookie('last', 'home.html')
    return res


@app.route('/set_<lang>')
def set_lang(lang):
    last = request.cookies.get("last")
    if last is None:
        last = "home.html"

    if lang in ["en", "fr"]:
        data = json.load(
            open(
                "lang/{}.lang".format(
                    lang
                )
            )
        )
    else:
        data = get_language()

    res = make_response(render_template(last, lang=data))
    res.set_cookie('language', lang)
    return res


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5005)
