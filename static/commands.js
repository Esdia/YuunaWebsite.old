let command_list;

function change_module(module) {
    let cmds = document.getElementsByClassName("cmd");

    let root = window.location.href;
    switch (module) {
        case root+"#all":
            for(let i = 0; i < cmds.length; i++) cmds[i].style.display = "block";
            break;
        case root+"#staff":
            for(let i = 0; i < cmds.length; i++) {
                if(command_list[i]['perm'] !== "None") cmds[i].style.display = "block";
                else cmds[i].style.display = "none";
            }
            break;
        case root+"#non-staff":
            for(let i = 0; i < cmds.length; i++) {
                if(command_list[i]['perm'] !== "None") cmds[i].style.display = "none";
                else cmds[i].style.display = "block";
            }
            break;
        default:
            for(let i = 0; i < cmds.length; i++) {
                if(root+"#"+command_list[i]['module_id'] !== module) cmds[i].style.display = "none";
                else cmds[i].style.display = "block";
            }
            break;
    }
    return false;
}

function set_event(cmd_list) {
    command_list = cmd_list;
    let menu = document.getElementById("side_menu_ul");

    for(let i = 0; i < menu.children.length; i++) {
        let elem = menu.children[i].children[0];

        elem.onclick = (
            function () {
                let href = elem..href;
                return change_module(href);
            }
        );
    }
}