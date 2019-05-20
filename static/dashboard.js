let default_infos;
let items = [
        {
            'info_key': "prefix",
            'id_name': "prefix",
            'data_func': data_input
        },
        {
            'info_key': "language_selected",
            'id_name': "language_select",
            'data_func': data_select
        },
        {
            'info_key': "disable",
            'id_name': "disable_selected",
            'data_func': data_multiple_choice
        },
        {
            'info_key': "autorole",
            'id_name': "autorole",
            'data_func': data_select
        },
        {
            'info_key': "bot_master",
            'id_name': "bot_master",
            'data_func': data_select
        },
        {
            'info_key': "confirm",
            'id_name': "confirm",
            'data_func': data_check
        },
        {
            'info_key': "levels",
            'id_name': "levels",
            'data_func': data_check
        },
        {
            'info_key': "ban_channels",
            'id_name': "ban_channels_selected",
            'data_func': data_multiple_choice
        },
        {
            'info_key': "ban_roles",
            'id_name': "ban_roles_selected",
            'data_func': data_multiple_choice
        },
        {
            'info_key': "message",
            'id_name': "level_up_message",
            'data_func': data_input
        },
        {
            'info_key': "message_disabled",
            'id_name': "message_disabled",
            'data_func': data_check
        },
        {
            'info_key': "message_private",
            'id_name': "message_private",
            'data_func': data_check
        },
        {
            'info_key': "antispam",
            'id_name': "antispam",
            'data_func': data_input
        },
        {
            'info_key': "bankreward",
            'id_name': "bankreward",
            'data_func': data_input
        },
        {
            'info_key': "role_rewards",
            'id_name': "role_reward_set_div",
            'data_func': data_reward
        }
    ];

function check_different(a, b) {
    if (a === b) return false;
    if (a == null || b == null) return true;
    if (a.length !== b.length) return true;

    a.sort();
    b.sort();

    for(let i = 0; i < a.length; i++) {
        if(a[i].constructor !== b[i].constructor) return true;
        if(a[i].constructor === Array) {
            if(check_different(a[i], b[i])) return true
        } else if(a[i] !== b[i]) return true;
    }
    return false;
}

function different_reward(value, _default) {
    let valInDefault = value.every(
        (val) =>
            _default.some(
                (def) => val[0] === def['id'] && val[1] === def['level']
            )
    );
    let defaultInVal = _default.every(
        (def) =>
            value.some(
                (val) => val[0] === def['id'] && val[1] === def['level']
            )
    );
    return !valInDefault || !defaultInVal;
}

function check_default() {
    for(let i = 0; i < items.length; i++) {
        let id_name = items[i]['id_name'];
        let value = items[i]['data_func'](id_name);
        let _default = default_infos[items[i]['info_key']];

        let x = document.getElementById(items[i]['info_key'] + "_button");

        if (id_name !== "role_reward_set_div") {
            if (value.constructor === Array) {
                if (check_different(value, _default)) {
                    x.style.display = "unset";
                } else {
                    x.style.display = "none";
                }
            } else if (value !== _default) {
                x.style.display = "unset";
            } else {
                x.style.display = "none";
            }
        } else {
            if(different_reward(value, _default)) {
                x.style.display = "unset";
            } else {
                x.style.display = "none";
            }
        }
    }


}

function check_reward_syntax() {
    let value = [
        data_select("role"),
        data_input("level"),
    ];

    let x = document.getElementById("add_reward_button");
    if(value[0] !== "None" && !isNaN(value[1]) && 0 < +value[1] && +value[1] <= 100) {
        let value_set = data_reward("role_reward_set_div");
        let display = value_set.every(
            (val) => val[0] !== value[0] || val[1] !== value[1]
        );

        if (display) x.style.display = "unset";
        else x.style.display = "none";
    } else {
        x.style.display = "none";
    }
}

/* This function sends the value to the url */
function send_data(url, value, traditional=false) {
    $.ajax({
        url: url,
        data: {
            post: value,
        },
        traditional: traditional
    });
}

/* This functions retrieve data */

/* For input type field */
function data_input(id_name) {
    let x = document.getElementById(id_name);
    return x.value;
}

/* For select type field */
function data_select(id_name) {
    let x = document.getElementById(id_name);
    return x.options[x.selectedIndex].value;
}

/* For multiple choices */
function data_multiple_choice(class_name) {
    let x = document.getElementsByClassName(class_name);
    let return_value = [];
    for(let i = 0; i < x.length; i++) {
        if (x[i].style.display === "flex") {
            return_value.push(x[i].value);
        }
    }

    return return_value;
}

/* For checkboxes type field */
function data_check(id_name) {
    let x = document.getElementById(id_name);
    if (x.checked) {
        return 1
    }
    return 0;
}

/* For the role rewards */
function data_reward(id_name) {
    let values = [];
    let x = document.getElementById(id_name).children;

    for(let i = 0; i < x.length; i++) {
        if(x[i].style.display !== "none") {
            let vals = [];
            for(let j = 0; j < x[i].children.length; j++) {
                if(x[i].children[j].classList.contains("role_set")) {
                    vals.push(x[i].children[j].children[0].id);
                } else if (x[i].children[j].classList.contains("level_set")) {
                    vals.push(x[i].children[j].children[0].innerHTML);
                }
            }
            values.push(vals);
        }
    }
    return values;
}

/* This function sends the values to the python app */
function send_prefix() {
    let value = data_input("prefix");
    if (value === "") {
        value = "y!";
        document.getElementById("prefix").value = value
    }
    default_infos["prefix"] = value;

    send_data("/form_prefix", value);
}

function send_language() {
    let value = data_select("language_select");
    default_infos["language_selected"] = value;

    send_data("/form_language", value);
}

function send_disable() {
    let value = data_multiple_choice("disable_selected");
    default_infos["disable"] = jQuery.extend([], value);

    send_data("/form_disable", value, true);
}

function send_autorole() {
    let value = data_select("autorole");
    default_infos["autorole"] = value;

    send_data("/form_autorole", value);
}

function send_bot_master() {
    let value = data_select("bot_master");
    default_infos["bot_master"] = value;

    send_data("/form_bot_master", value);
}

function send_confirm() {
    let value = data_check("confirm");
    default_infos["confirm"] = value;

    send_data("/form_confirm", value);
}

function send_levels() {
    let value = data_check("levels");
    default_infos["levels"] = value;

    send_data("/form_levels", value)
}

function send_ban_channels() {
    let value = data_multiple_choice("ban_channels_selected");
    default_infos["ban_channels"] = jQuery.extend([], value);

    send_data("/form_ban_channels", value, true);
}

function send_ban_roles() {
    let value = data_multiple_choice("ban_roles_selected");
    default_infos["ban_roles"] = jQuery.extend([], value);

    send_data("/form_ban_roles", value, true);
}

function send_level_up_message() {
    let value = data_input("level_up_message");
    if (value === "") {
        default_infos["message"] = default_infos["default_message"];
        document.getElementById("level_up_message").value = default_infos["message"];
    }
    else default_infos["message"] = value;

    send_data("/form_message", value);
}

function send_message_disabled() {
    let value = data_check("message_disabled");
    default_infos["message_disabled"] = value;

    send_data("/form_sent", value);
}

function send_message_private() {
    let value = data_check("message_private");
    default_infos["message_private"] = value;

    send_data("/form_private", value);
}

function send_antispam() {
    let value = data_input("antispam");
    if (value === "") {
        value = "60";
        document.getElementById("antispam").value = value;
    }
    default_infos["antispam"] = value;

    send_data("/form_antispam", value);
}

function send_bankreward() {
    let value = data_input("bankreward");
    if (value === "") {
        value = "50";
        document.getElementById("bankreward").value = value;
    }
    default_infos["bankreward"] = value;

    send_data("/form_bankreward", value);
}

function send_reward() {
    let value = data_reward("role_reward_set_div");

    let def = [];
    for(let i = 0; i < value.length; i++) {
        def.push(
            {
                'id': value[i][0],
                'level': value[i][1]
            }
        )
    }
    default_infos["role_rewards"] = def;

    send_data("/form_role_reward", value, true);
}

/* This function drops the dropdown menus in the multiple choices fields */
function drop(item) {
    document.getElementById(item+"_choices_div").classList.toggle("show_"+item);
    return false;
}

/* This function draws back the dropdowns menus if we click outside of them
* It also checks if the form fields are still on their default values */
window.onclick = function(event) {
    let items = [
        "disable",
        "ban_channels",
        "ban_roles"
    ];

    for(let i = 0; i < items.length; i++) {
        let to_check = [
            "#drop_"+items[i]+"_button",
            "."+items[i]+"_choices_div",
            ".choice_"+items[i],
            "#"+items[i]+"_plus_button",
            "."+items[i]+"_delete_button"
        ];
        let hide = true;
        for(let j = 0; j < to_check.length; j++) {
            hide = hide && (!event.target.matches(to_check[j]))
        }


        if(hide) {
            let isShown = document.getElementById(items[i]+"_choices_div").classList.contains("show_"+items[i]);
            if (isShown) {
                drop(items[i]);
            }
        }
    }
};

function click_key_event() {
    check_default();
    check_reward_syntax();
}

function set_event(infos) {
    default_infos = infos;
    document.body.onclick = () => click_key_event();
    document.body.onkeyup = () => click_key_event();
}

/* This functions selects a value in the multiple choices fields */
function select(elem, item) {
    elem.style.display="none";

    let value = elem.value;

    let selected = document.getElementById(item+"_selected");
    for(let i = 0; i < selected.children.length; i++) {
        if(selected.children[i].value === value) {
            selected.children[i].style.display = "flex";
        }
    }
}

/* This functions un-selects a value in the multiple choices fields */
function unselect(elem, item) {
    elem.style.display="none";

    let value = elem.value;

    let choices = document.getElementById(item+"_choices_div");
    for(let i = 0; i < choices.children.length; i++) {
        if(choices.children[i].value === value) {
            choices.children[i].style.display = "unset";
        }
    }
}

/* This function deletes a role reward */
function reward_delete(elem) {
    elem.style.display = "none";
}

/* This function adds as role reward */
function add_role_reward() {
    let value = [
        data_select("role"),
        data_input("level")
    ];

    let x = document.getElementById("role_reward_set_div");
    let div_in = x.children;

    for(let i = 0; i < div_in.length; i++) {
        let vals = [];

        for(let j = 0; j < div_in[i].children.length; j++) {
            if(div_in[i].children[j].classList.contains("role_set")) {
                vals.push(div_in[i].children[j].children[0].id);
            } else if (div_in[i].children[j].classList.contains("level_set")) {
                vals.push(div_in[i].children[j].children[0].innerHTML);
            }
        }

        if (vals[0] === value[0] && vals[1] === value[1]) {
            div_in[i].style.display = "flex";
            return;
        }
    }

    let div = document.createElement("DIV");
    div.classList.add("role_reward_set_div_in");
    div.style.display = "flex";

    let role_set = document.createElement("DIV");
    role_set.classList.add("role_set");

    let level_set = document.createElement("DIV");
    level_set.classList.add("level_set");

    let p_role = document.createElement("P");
    let y = document.getElementById("role");
    p_role.innerHTML = y.options[y.selectedIndex].innerHTML;
    p_role.id = value[0];

    let p_level = document.createElement("P");
    p_level.innerHTML = value[1];

    let button = document.createElement("BUTTON");
    button.classList.add("reward_delete_button");
    button.onclick = function() {reward_delete(this.parentElement);};

    let img = document.createElement("IMG");
    img.alt = "delete";
    img.classList.add("delete_button");
    img.src = "/static/image/delete_button.png";

    button.appendChild(img);
    role_set.appendChild(p_role);
    level_set.appendChild(p_level);
    div.appendChild(role_set);
    div.appendChild(level_set);
    div.appendChild(button);

    document.getElementById("role").selectedIndex = 0;
    document.getElementById("level").value = "";

    for(let i = 0; i < div_in.length; i++) {
        let lvl = div_in[i].children[1].children[0].innerHTML;
        if (+value[1] <= +lvl) {
            x.insertBefore(div, div_in[i]);
            return;
        }
    }

    x.appendChild(div);
}