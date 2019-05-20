let command_list;

function change_module(module) {
    let cmds = document.getElementsByClassName("cmd");
    switch (module) {
        case "#all":
            for(let i = 0; i < cmds.length; i++) cmds[i].style.display = "unset";
            break;
        case "#staff":
            for(let i = 0; i < cmds.length; i++) {
                if(command_list[i]['perm'] !== "None") cmds[i].style.display = "unset";
                else cmds[i].style.display = "none";
            }
            break;
        case "#non-staff":
            for(let i = 0; i < cmds.length; i++) {
                if(command_list[i]['perm'] !== "None") cmds[i].style.display = "none";
                else cmds[i].style.display = "unset";
            }
            break;
        default:
            for(let i = 0; i < cmds.length; i++) {
                if("#"+command_list[i]['module_id'] !== module) cmds[i].style.display = "none";
                else cmds[i].style.display = "unset";
            }
            break;
    }
    return false;
}

function set_event(cmd_list) {
    command_list = cmd_list;
    let menu = document.getElementById("side_menu_ul");

    for(let i = 0; i < menu.children.length; i++) {
        let elem = menu.children[i];

        elem.onclick = (
            function () {
                let href = elem.children[0].href;
                return change_module(href);
            }
        );
    }
}