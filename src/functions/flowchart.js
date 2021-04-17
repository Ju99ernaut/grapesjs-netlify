export default (editor, opts = {}) => {
    const { $ } = editor;

    const $el = $(`<div class="wrapper">
        <div class="col">
            <div class="drag-drawflow" draggable="true" data-node="facebook">
                <i class="fa fa-facebook"></i><span> Facebook</span>
            </div>
            <div class="drag-drawflow" draggable="true" data-node="slack">
                <i class="fa fa-slack"></i><span> Slack recive</span>
            </div>
            <div class="drag-drawflow" draggable="true" data-node="github">
                <i class="fa fa-github"></i><span> Github Star</span>
            </div>
            <div class="drag-drawflow" draggable="true" data-node="telegram">
                <i class="fa fa-telegram"></i><span> Telegram send</span>
            </div>
            <div class="drag-drawflow" draggable="true" data-node="aws">
                <i class="fa fa-amazon"></i><span> AWS</span>
            </div>
            <div class="drag-drawflow" draggable="true" data-node="log">
                <i class="fa fa-file-text"></i><span> File Log</span>
            </div>
            <div class="drag-drawflow" draggable="true" data-node="google">
                <i class="fa fa-google"></i><span> Google Drive save</span>
            </div>
            <div class="drag-drawflow" draggable="true" data-node="email">
                <i class="fa fa-at"></i><span> Email send</span>
            </div>
            <div class="drag-drawflow" draggable="true" data-node="template">
                <i class="fa fa-code"></i><span> Template</span>
            </div>
            <div class="drag-drawflow" draggable="true" data-node="multiple">
                <i class="fa fa-microchip"></i><span> Multiple</span>
            </div>
            <div class="drag-drawflow" draggable="true" data-node="personalized">
                <i class="fa fa-cubes"></i><span> Personalized</span>
            </div>
            <div class="drag-drawflow" draggable="true" data-node="dbclick">
                <i class="fa fa-mouse-pointer"></i><span> DBClick!</span>
            </div>
        </div>
        <div class="col-right">
            <div class="menu">
                <ul>
                    <li class="selected">Home</li>
                    <li>Other</li>
                </ul>
            </div>
        <div id="drawflow">

            <div class="btn-export">Export</div>
            <div class="btn-clear">Clear</div>
            <div class="btn-lock">
                <i id="lock" class="fa fa-lock"></i>
                <i id="unlock" class="fa fa-unlock" style="display:none;"></i>
            </div>
            <div class="bar-zoom">
                <i class="fa fa-search-minus"></i>
                <i class="fa fa-search"></i>
                <i class="fa fa-search-plus"></i>
            </div>
        </div>
        </div>
    </div>`);

    const canvas = $el.find('#drawflow');
    const id = canvas.get(0);
    const flowEditor = new Drawflow(id);
    flowEditor.reroute = true;
    flowEditor.reroute_fix_curvature = true;
    flowEditor.force_first_input = false;

    flowEditor.createCurvature = function (start_pos_x, start_pos_y, end_pos_x, end_pos_y, curvature_value, type) {
        const line_x = start_pos_x;
        const line_y = start_pos_y;
        const x = end_pos_x;
        const y = end_pos_y;
        const curvature = curvature_value;
        //type openclose open close other
        switch (type) {
            case 'open':
            case 'close':
            case 'other':
                if (start_pos_x >= end_pos_x) {
                    return ' M ' + line_x + ' ' + line_y + ' q ' + (x - line_x) / 2 + ' ' + (y - line_y) + ' ' + (x - line_x) + ' ' + (y - line_y);
                } else {
                    return ' M ' + line_x + ' ' + line_y + ' q ' + (x - line_x) / 2 + ' ' + (y - line_y) + ' ' + (x - line_x) + ' ' + (y - line_y);
                }
            default:
                const hx1 = line_x + Math.abs(x - line_x) * curvature;
                const hx2 = x - Math.abs(x - line_x) * curvature;
                return ' M ' + line_x + ' ' + line_y + ' C ' + hx1 + ' ' + line_y + ' ' + hx2 + ' ' + y + ' ' + x + '  ' + y;
        }
    }


    flowEditor.drawflow = { "drawflow": { "Home": { "data": { "1": { "id": 1, "name": "welcome", "data": {}, "class": "welcome", "html": "\n    <div>\n      <div class=\"title-box\">👏 Welcome!!</div>\n      <div class=\"box\">\n        <p>Simple flow library <b>demo</b>\n        <a href=\"https://github.com/jerosoler/Drawflow\" target=\"_blank\">Drawflow</a> by <b>Jero Soler</b></p><br>\n\n        <p>Multiple input / outputs<br>\n           Data sync nodes<br>\n           Import / export<br>\n           Modules support<br>\n           Simple use<br>\n           Type: Fixed or Edit<br>\n           Events: view console<br>\n           Pure Javascript<br>\n        </p>\n        <br>\n        <p><b><u>Shortkeys:</u></b></p>\n        <p>🎹 <b>Delete</b> for remove selected<br>\n        💠 Mouse Left Click == Move<br>\n        ❌ Mouse Right == Delete Option<br>\n        🔍 Ctrl + Wheel == Zoom<br>\n        📱 Mobile support<br>\n        ...</p>\n      </div>\n    </div>\n    ", "typenode": false, "inputs": {}, "outputs": {}, "pos_x": 50, "pos_y": 50 }, "2": { "id": 2, "name": "slack", "data": {}, "class": "slack", "html": "\n          <div>\n            <div class=\"title-box\"><i class=\"fa fa-slack\"></i> Slack chat message</div>\n          </div>\n          ", "typenode": false, "inputs": { "input_1": { "connections": [{ "node": "7", "input": "output_1" }] } }, "outputs": {}, "pos_x": 1028, "pos_y": 87 }, "3": { "id": 3, "name": "telegram", "data": { "channel": "channel_2" }, "class": "telegram", "html": "\n          <div>\n            <div class=\"title-box\"><i class=\"fa fa-telegram-plane\"></i> Telegram bot</div>\n            <div class=\"box\">\n              <p>Send to telegram</p>\n              <p>select channel</p>\n              <select df-channel>\n                <option value=\"channel_1\">Channel 1</option>\n                <option value=\"channel_2\">Channel 2</option>\n                <option value=\"channel_3\">Channel 3</option>\n                <option value=\"channel_4\">Channel 4</option>\n              </select>\n            </div>\n          </div>\n          ", "typenode": false, "inputs": { "input_1": { "connections": [{ "node": "7", "input": "output_1" }] } }, "outputs": {}, "pos_x": 1032, "pos_y": 184 }, "4": { "id": 4, "name": "email", "data": {}, "class": "email", "html": "\n            <div>\n              <div class=\"title-box\"><i class=\"fa fa-at\"></i> Send Email </div>\n            </div>\n            ", "typenode": false, "inputs": { "input_1": { "connections": [{ "node": "5", "input": "output_1" }] } }, "outputs": {}, "pos_x": 1033, "pos_y": 439 }, "5": { "id": 5, "name": "template", "data": { "template": "Write your template" }, "class": "template", "html": "\n            <div>\n              <div class=\"title-box\"><i class=\"fa fa-code\"></i> Template</div>\n              <div class=\"box\">\n                Ger Vars\n                <textarea df-template></textarea>\n                Output template with vars\n              </div>\n            </div>\n            ", "typenode": false, "inputs": { "input_1": { "connections": [{ "node": "6", "input": "output_1" }] } }, "outputs": { "output_1": { "connections": [{ "node": "4", "output": "input_1" }, { "node": "11", "output": "input_1" }] } }, "pos_x": 607, "pos_y": 304 }, "6": { "id": 6, "name": "github", "data": { "name": "https://github.com/jerosoler/Drawflow" }, "class": "github", "html": "\n          <div>\n            <div class=\"title-box\"><i class=\"fa fa-github \"></i> Github Stars</div>\n            <div class=\"box\">\n              <p>Enter repository url</p>\n            <input type=\"text\" df-name>\n            </div>\n          </div>\n          ", "typenode": false, "inputs": {}, "outputs": { "output_1": { "connections": [{ "node": "5", "output": "input_1" }] } }, "pos_x": 341, "pos_y": 191 }, "7": { "id": 7, "name": "facebook", "data": {}, "class": "facebook", "html": "\n        <div>\n          <div class=\"title-box\"><i class=\"fa fa-facebook\"></i> Facebook Message</div>\n        </div>\n        ", "typenode": false, "inputs": {}, "outputs": { "output_1": { "connections": [{ "node": "2", "output": "input_1" }, { "node": "3", "output": "input_1" }, { "node": "11", "output": "input_1" }] } }, "pos_x": 347, "pos_y": 87 }, "11": { "id": 11, "name": "log", "data": {}, "class": "log", "html": "\n            <div>\n              <div class=\"title-box\"><i class=\"fa fa-file-text\"></i> Save log file </div>\n            </div>\n            ", "typenode": false, "inputs": { "input_1": { "connections": [{ "node": "5", "input": "output_1" }, { "node": "7", "input": "output_1" }] } }, "outputs": {}, "pos_x": 1031, "pos_y": 363 } } }, "Other": { "data": { "8": { "id": 8, "name": "personalized", "data": {}, "class": "personalized", "html": "\n            <div>\n              Personalized\n            </div>\n            ", "typenode": false, "inputs": { "input_1": { "connections": [{ "node": "12", "input": "output_1" }, { "node": "12", "input": "output_2" }, { "node": "12", "input": "output_3" }, { "node": "12", "input": "output_4" }] } }, "outputs": { "output_1": { "connections": [{ "node": "9", "output": "input_1" }] } }, "pos_x": 764, "pos_y": 227 }, "9": { "id": 9, "name": "dbclick", "data": { "name": "Hello World!!" }, "class": "dbclick", "html": "\n            <div>\n            <div class=\"title-box\"><i class=\"fa fa-mouse-pointer\"></i> Db Click</div>\n              <div class=\"box dbclickbox\" ondblclick=\"showpopup(event)\">\n                Db Click here\n                <div class=\"modal\" style=\"display:none\">\n                  <div class=\"modal-content\">\n                    <span class=\"close\" onclick=\"closemodal(event)\">&times;</span>\n                    Change your variable {name} !\n                    <input type=\"text\" df-name>\n                  </div>\n\n                </div>\n              </div>\n            </div>\n            ", "typenode": false, "inputs": { "input_1": { "connections": [{ "node": "8", "input": "output_1" }] } }, "outputs": { "output_1": { "connections": [{ "node": "12", "output": "input_2" }] } }, "pos_x": 209, "pos_y": 38 }, "12": { "id": 12, "name": "multiple", "data": {}, "class": "multiple", "html": "\n            <div>\n              <div class=\"box\">\n                Multiple!\n              </div>\n            </div>\n            ", "typenode": false, "inputs": { "input_1": { "connections": [] }, "input_2": { "connections": [{ "node": "9", "input": "output_1" }] }, "input_3": { "connections": [] } }, "outputs": { "output_1": { "connections": [{ "node": "8", "output": "input_1" }] }, "output_2": { "connections": [{ "node": "8", "output": "input_1" }] }, "output_3": { "connections": [{ "node": "8", "output": "input_1" }] }, "output_4": { "connections": [{ "node": "8", "output": "input_1" }] } }, "pos_x": 179, "pos_y": 272 } } } } }
    flowEditor.start();

    const dragNodes = $el.find('.drag-drawflow');
    /* Click events */
    $el.find('li').click(ev => {
        flowEditor.changeModule(ev.currentTarget.innerText.trim());
        changeModule(ev);
    });
    $el.find('.btn-export').click(ev => {
        console.log('<pre><code>' + JSON.stringify(flowEditor.export(), null, 4) + '</code></pre>');
    });
    $el.find('.btn-clear').click(ev => {
        flowEditor.clearModuleSelected();
    });
    $el.find('#lock').click(ev => {
        flowEditor.editor_mode = 'fixed';
        changeMode('lock');
    });
    $el.find('#unlock').click(ev => {
        flowEditor.editor_mode = 'edit';
        changeMode('unlock');
    });
    $el.find('.fa-search-minus').click(ev => {
        flowEditor.zoom_out();
    });
    $el.find('.fa-search').click(ev => {
        flowEditor.zoom_reset();
    });
    $el.find('.fa-search-plus').click(ev => {
        flowEditor.zoom_in();
    });

    /* DRAG EVENT */
    dragNodes.on('dragstart', drag);
    canvas.on('drop', drop);
    canvas.on('dragover', allowDrop);
    /* Mouse and Touch Actions */
    dragNodes.each((i, el) => {
        el.addEventListener('touchend', drop, false);
        el.addEventListener('touchmove', positionMobile, false);
        el.addEventListener('touchstart', drag, false);
    });

    let mobile_item_selec = '';
    let mobile_last_move = null;
    function positionMobile(ev) {
        mobile_last_move = ev;
    }

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        if (ev.type === "touchstart") {
            mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
        } else {
            ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
        }
    }

    function drop(ev) {
        if (ev.type === "touchend") {
            var parentdrawflow = document.elementFromPoint(mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow");
            if (parentdrawflow != null) {
                addNodeToDrawFlow(mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY);
            }
            mobile_item_selec = '';
        } else {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("node");
            addNodeToDrawFlow(data, ev.clientX, ev.clientY);
        }

    }

    function addNodeToDrawFlow(name, pos_x, pos_y) {
        if (flowEditor.editor_mode === 'fixed') {
            return false;
        }
        pos_x = pos_x * (flowEditor.precanvas.clientWidth / (flowEditor.precanvas.clientWidth * flowEditor.zoom)) - (flowEditor.precanvas.getBoundingClientRect().x * (flowEditor.precanvas.clientWidth / (flowEditor.precanvas.clientWidth * flowEditor.zoom)));
        pos_y = pos_y * (flowEditor.precanvas.clientHeight / (flowEditor.precanvas.clientHeight * flowEditor.zoom)) - (flowEditor.precanvas.getBoundingClientRect().y * (flowEditor.precanvas.clientHeight / (flowEditor.precanvas.clientHeight * flowEditor.zoom)));


        switch (name) {
            case 'facebook':
                var facebook = `
                <div>
                    <div class="title-box"><i class="fa fa-facebook"></i> Facebook Message</div>
                </div>
                `;
                flowEditor.addNode('facebook', 0, 1, pos_x, pos_y, 'facebook', {}, facebook);
                break;
            case 'slack':
                var slackchat = `
                <div>
                <div class="title-box"><i class="fa fa-slack"></i> Slack chat message</div>
                </div>
                `
                flowEditor.addNode('slack', 1, 0, pos_x, pos_y, 'slack', {}, slackchat);
                break;
            case 'github':
                var githubtemplate = `
                <div>
                <div class="title-box"><i class="fa fa-github "></i> Github Stars</div>
                <div class="box">
                    <p>Enter repository url</p>
                <input type="text" df-name>
                </div>
                </div>
                `;
                flowEditor.addNode('github', 0, 1, pos_x, pos_y, 'github', { "name": '' }, githubtemplate);
                break;
            case 'telegram':
                var telegrambot = `
                <div>
                <div class="title-box"><i class="fa fa-paper-plane"></i> Telegram bot</div>
                <div class="box">
                    <p>Send to telegram</p>
                    <p>select channel</p>
                    <select df-channel>
                    <option value="channel_1">Channel 1</option>
                    <option value="channel_2">Channel 2</option>
                    <option value="channel_3">Channel 3</option>
                    <option value="channel_4">Channel 4</option>
                    </select>
                </div>
                </div>
                `;
                flowEditor.addNode('telegram', 1, 0, pos_x, pos_y, 'telegram', { "channel": 'channel_3' }, telegrambot);
                break;
            case 'aws':
                var aws = `
                <div>
                <div class="title-box"><i class="fa fa-amazon"></i> Aws Save </div>
                <div class="box">
                    <p>Save in aws</p>
                    <input type="text" df-db-dbname placeholder="DB name"><br><br>
                    <input type="text" df-db-key placeholder="DB key">
                    <p>Output Log</p>
                </div>
                </div>
                `;
                flowEditor.addNode('aws', 1, 1, pos_x, pos_y, 'aws', { "db": { "dbname": '', "key": '' } }, aws);
                break;
            case 'log':
                var log = `
                <div>
                    <div class="title-box"><i class="fa fa-file-text"></i> Save log file </div>
                </div>
                `;
                flowEditor.addNode('log', 1, 0, pos_x, pos_y, 'log', {}, log);
                break;
            case 'google':
                var google = `
                <div>
                    <div class="title-box"><i class="fa fa-google"></i> Google Drive save </div>
                </div>
                `;
                flowEditor.addNode('google', 1, 0, pos_x, pos_y, 'google', {}, google);
                break;
            case 'email':
                var email = `
                <div>
                    <div class="title-box"><i class="fa fa-at"></i> Send Email </div>
                </div>
                `;
                flowEditor.addNode('email', 1, 0, pos_x, pos_y, 'email', {}, email);
                break;
            case 'template':
                var template = `
                <div>
                    <div class="title-box"><i class="fa fa-code"></i> Template</div>
                    <div class="box">
                    Ger Vars
                    <textarea df-template></textarea>
                    Output template with vars
                    </div>
                </div>
                `;
                flowEditor.addNode('template', 1, 1, pos_x, pos_y, 'template', { "template": 'Write your template' }, template);
                break;
            case 'multiple':
                var multiple = `
                <div>
                    <div class="box">
                    Multiple!
                    </div>
                </div>
                `;
                flowEditor.addNode('multiple', 3, 4, pos_x, pos_y, 'multiple', {}, multiple);
                break;
            case 'personalized':
                var personalized = `
                <div>
                    Personalized
                </div>
                `;
                flowEditor.addNode('personalized', 1, 1, pos_x, pos_y, 'personalized', {}, personalized);
                break;
            case 'dbclick':
                var dbclick = `
                <div>
                <div class="title-box"><i class="fa fa-mouse-pointer"></i> Db Click</div>
                    <div class="box dbclickbox" ondblclick="showpopup(event)">
                    Db Click here
                    <div class="modal" style="display:none">
                        <div class="modal-content">
                        <span class="close" onclick="closemodal(event)">&times;</span>
                        Change your variable {name} !
                        <input type="text" df-name>
                        </div>
                    </div>
                    </div>
                </div>
                `;
                flowEditor.addNode('dbclick', 1, 1, pos_x, pos_y, 'dbclick', { name: '' }, dbclick);
                break;

            default:
        }
    }

    const all = $el.find(".menu ul li");
    function changeModule(event) {
        all.removeClass('selected');
        event.target.classList.add('selected');
    }

    const lock = $el.find('#lock').get(0);
    const unlock = $el.find('#unlock').get(0);
    function changeMode(option) {
        //console.log(lock.id);
        if (option == 'lock') {
            lock.style.display = 'none';
            unlock.style.display = 'block';
        } else {
            lock.style.display = 'block';
            unlock.style.display = 'none';
        }
    }

    return $el;
}