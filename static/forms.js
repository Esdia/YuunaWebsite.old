let GUILD_ID;
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
            'info_key': "message_sent",
            'id_name': "message_sent",
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

/* Used to keep track of the defaults parameters */
function save_id(infos) {
    GUILD_ID = infos['guild_id'];
}

function check_default(default_infos) {
    for(let i = 0; i < items.length; i++) {
        let id_name = items[i]['id_name'];
        let value = items[i]['data_func'](id_name);
        let _default = default_infos[items[i]['info_key']];

        let x = document.getElementById(items[i]['info_key'] + "_button");
        if(value !== _default) {
            x.style.display = "unset";
        } else {
            x.style.display = "none";
        }
    }
}

function check_reward_syntax() {
    let value = [
        data_select("role"),
        data_input("level"),
    ];

    let x = document.getElementById("add_reward_button");
    if(value[0] !== "None" && value[1] !== "0") {
        x.style.display = "unset";
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
            _id: GUILD_ID
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
    return x.checked;
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
                    vals.push(x[i].children[j].children[0].innerHTML);
                } else if (x[i].children[j].classList.contains("level_set")) {
                    vals.push(x[i].children[j].children[0].innerHTML);
                }
            }
            values.push(vals);
        }
    }
    return values;
}

/* This function sends the values to the python app*/
function send_prefix() {
    let value = data_input("prefix");

    send_data("/form_prefix", value);
}

function send_language() {
    let value = data_select("language_select");

    send_data("/form_language", value);
}

function send_disable() {
    let value = data_multiple_choice("disable_selected");

    send_data("/form_disable", value, true);
}

function send_autorole() {
    let value = data_select("autorole");

    send_data("/form_autorole", value);
}

function send_bot_master() {
    let value = data_select("bot_master");

    send_data("/form_bot_master", value);
}

function send_confirm() {
    let value = data_check("confirm");

    send_data("/form_confirm", value);
}

function send_levels() {
    let value = data_check("levels");

    send_data("/form_levels", value)
}

function send_ban_channels() {
    let value = data_multiple_choice("ban_channels_selected");

    send_data("/form_ban_channels", value, true);
}

function send_ban_roles() {
    let value = data_multiple_choice("ban_roles_selected");

    send_data("/form_ban_roles", value, true);
}

function send_level_up_message() {
    let value = data_input("level_up_message");

    send_data("/form_message", value);
}

function send_message_sent() {
    let value = data_check("message_sent");

    send_data("/form_sent", value);
}

function send_message_private() {
    let value = data_check("message_private");

    send_data("/form_private", value);
}

function send_antispam() {
    let value = data_input("antispam");

    send_data("/form_antispam", value);
}

function send_bankreward() {
    let value = data_input("bankreward");

    send_data("/form_bankreward", value);
}

function send_reward() {
    let value = data_reward("role_reward_set_div");

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

function click_key_event(infos) {
    check_default(infos);
    check_reward_syntax();
}

function set_event(infos) {
    window.onload = function () {
        document.body.onclick = () => click_key_event(infos);
        document.body.onkeypress = () => click_key_event(infos)
    };
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
function add_role_reward(role_id) {
    let value = [
        data_select("role"),
        data_input("level"),
    ];

    let x = document.getElementById("role_reward_set_div");

    let div = document.createElement("DIV");
    div.classList.add("role_reward_set_div_in");
    div.style.display = "flex";

    let role_set = document.createElement("DIV");
    role_set.classList.add("role_set");

    let level_set = document.createElement("DIV");
    level_set.classList.add("level_set");

    let p_role = document.createElement("P");
    p_role.innerHTML = value[0];
    p_role.id = role_id;

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
    x.appendChild(div);
}