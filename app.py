import json
import os

from flask import Flask, render_template, make_response, request, redirect, url_for, session
from requests_oauthlib import OAuth2Session

app = Flask(__name__)

REDIRECT_URI = os.environ.get('SITE_URL') + "confirm_login"
CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')
TOKEN_URL = os.environ.get('TOKEN_URL')
AUTH_URL = os.environ.get('AUTH_URL')

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')


def get_language():
    lang = request.cookies.get("language")
    if lang not in ["en", "fr"]:
        lang = "en"

    return json.load(
        open(
            "lang/{}.json".format(
                lang
            )
        )
    )


def load(page, lang=None, menu=None, command_list=None):
    res = make_response(
        render_template(
            "{}.html".format(page),
            lang=(get_language() if lang is None else lang),
            menu=menu,
            command_list=command_list
        )
    )
    res.set_cookie('last', page)
    return res


@app.route('/')
def home():
    return load('home')


@app.route('/features')
def features():
    lang = get_language()
    menu = {
        lang['page.top']: "#",
        lang['features.config']: "#conf",
        lang['features.XP']: "#XP",
        lang['features.bank']: "#bank",
        lang['features.games']: "#games",
        lang['features.moderation']: "#moderation"
    }
    return load('features', lang=lang, menu=menu)


def get_command(command_json, command):
    return {
        "module": command_json[command]['module'],
        "module_id": command_json[command]['module_id'],
        "command": command_json[command]['command'],
        "description": command_json[command]["description"],
        "perm": command_json[command]['perm'],
    }


@app.route('/commands')
def commands():
    command_list = []
    if 'module' in session:
        module = session['module']
    else:
        module = "all"

    lang = request.cookies.get('language')
    lang = "en" if lang is None else lang
    command_json = json.load(
        open(
            "lang/commands/commands_{}.json".format(
                lang
            )
        )
    )
    lang_data = get_language()
    if module == "staff":
        for command in command_json:
            cmd = get_command(command_json, command)
            if cmd["perm"] != "None":
                command_list.append(
                    cmd
                )
    elif module == "non-staff":
        for command in command_json:
            cmd = get_command(command_json, command)
            if cmd['perm'] == "None":
                command_list.append(
                    cmd
                )
    elif module == "all":
        for command in command_json:
            command_list.append(
                get_command(command_json, command)
            )
    else:
        for command in command_json:
            cmd = get_command(command_json, command)
            if cmd['module_id'] == str(module):
                command_list.append(
                    cmd
                )

    menu = {
        lang_data['commands_all']: "/commands_all",
        lang_data['commands_staff']: "/commands_staff",
        lang_data['commands_non-staff']: "/commands_non-staff",
        lang_data['commands_misc']: "/commands_1",
        lang_data['commands_conf']: "/commands_2",
        lang_data['commands_xp']: "/commands_3",
        lang_data['commands_bank']: "/commands_4",
        lang_data['commands_games']: "/commands_5",
        lang_data['commands_mod']: "/commands_6"
    }

    return load('commands', lang=lang_data, menu=menu, command_list=command_list)


@app.route('/commands_<module>')
def commands_module(module):
    session['module'] = module
    return redirect(
        url_for('commands')
    )


@app.route('/dashboard')
def dashboard():
    # TODO

    if 'user' not in session:
        return redirect(
            url_for('login')
        )

    return load('skeleton')


def make_session(token=None, state=None, scope=None):
    return OAuth2Session(
        client_id=CLIENT_ID,
        auto_refresh_kwargs={
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        },
        token=token,
        state=state,
        scope=scope,
        redirect_uri=REDIRECT_URI,
        auto_refresh_url=TOKEN_URL,
    )


def get_user(discord_token):
    discord_session = make_session(token=discord_token)

    try:
        req = discord_session.get('https://discordapp.com/api/users/@me')
    except Exception:
        return None

    user = req.json()
    session['user'] = user
    return user


@app.route('/login')
def login():
    scope = ['identify', 'guilds']
    discord_session = make_session(scope=scope)
    auth_url, state = discord_session.authorization_url(
        AUTH_URL,
        access_type="offline"
    )
    session['oauth2_state'] = state
    return redirect(auth_url)


@app.route('/confirm_login')
def confirm_login():
    state = session.get('oauth2_state')
    last = request.cookies.get("last")
    if last is None:
        last = "home"

    if not state or request.values.get('error'):
        return redirect(
            url_for(
                last
            )
        )

    discord_session = make_session(state=state)
    discord_token = discord_session.fetch_token(
        TOKEN_URL,
        client_secret=CLIENT_SECRET,
        authorization_response=request.url
    )
    if not discord_token:
        return redirect(
            url_for(
                last
            )
        )
    user = get_user(discord_token)
    if not user:
        return redirect(
            url_for(
                'logout'
            )
        )

    session.permanent = True
    return redirect(
        url_for(
            last
        )
    )


@app.route('/logout')
def logout():
    last = request.cookies.get("last")
    if last is None:
        last = "home"

    session.clear()
    return redirect(
        url_for(
            last
        )
    )


@app.route('/set_<lang>')
def set_lang(lang):
    last = request.cookies.get("last")
    if last is None:
        last = "home"

    res = make_response(
        redirect(
            url_for(
                last
            )
        )
    )
    res.set_cookie('language', lang, max_age=60 * 60 * 24 * 365)
    return res


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5005)
