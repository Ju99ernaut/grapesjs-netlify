import { nodes } from './nodes';
import compiler from './compiler';

export default (editor, opts = {}) => {
    const { $ } = editor;

    const codeViewer = editor.CodeManager.createViewer({
        codeName: 'javascript',
        theme: 'material',
        readOnly: 1,
        autoBeautify: 1,
    });

    const attrsToString = attrs => {
        const result = [];

        for (let key in attrs) {
            let value = attrs[key];
            const toParse = value instanceof Array || value instanceof Object;
            value = toParse ? JSON.stringify(value) : value;
            result.push(`${key}=${toParse ? `'${value}'` : `'${value}'`}`);
        }

        return result.length ? ` ${result.join(' ')}` : '';
    };

    if (opts.nodes) {
        nodes = [...nodes, ...opts.nodes];
    }

    const $el = $(`<div class="wrapper">
        <div class="col">
            ${nodes.map(node => `<div class="drag-drawflow" draggable="true" data-node="${node.name}">
                <i ${attrsToString(node.attributes)}></i><span> ${node.label || node.name}</span>
            </div>`).join('\n')}
        </div>
        <div class="col-right">
            <div class="menu">
                <ul>
                    <li class="selected">Home</li>
                </ul>
            </div>
            <div id="drawflow">
                <div class="btn-export">Export</div>
                <div class="btn-clear">Clear</div>
                <div class="btn-add">
                    <input id="name" type="text" placeholder="name"/>
                    <i id="add" class="fa fa-plus"></i>
                </div>
                <div class="btn-preview">
                    <i id="preview" class="fa fa-code"></i>
                </div>
                <div class="btn-delete">
                    <i id="delete" class="fa fa-trash"></i>
                </div>
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
            <div id="drawflow-code" style="display:none;"></div>
        </div>
    </div>`);

    const canvas = $el.find('#drawflow');
    const codeCont = $el.find('#drawflow-code');
    const id = canvas.get(0);
    const flowEditor = new Drawflow(id);
    flowEditor.reroute = true;
    flowEditor.reroute_fix_curvature = true;

    flowEditor.drawflow = {
        "drawflow": {
            "Home": {
                "data": {
                    "1": {
                        "id": 1,
                        "name": "welcome",
                        "data": {},
                        "class": "welcome",
                        "html": "\n<div>\n<div class=\"title-box\">👏 Welcome!!</div>\n<div class=\"flow-box\">\n<p><b><u>Shortkeys:</u></b></p>\n<p>🎹 <b>Delete</b> for remove selected<br>\n💠 Mouse Left Click == Move<br>\n❌ Mouse Right == Delete Option<br>\n🔍 Ctrl + Wheel == Zoom<br>\n📱 Mobile support<br>\n...</p>\n</div>\n</div>\n",
                        "typenode": false,
                        "inputs": {},
                        "outputs": {},
                        "pos_x": 50,
                        "pos_y": 50
                    }
                }
            }
        }
    }
    flowEditor.start();

    //Add code viewer
    codeViewer.refresh();
    setTimeout(() => codeViewer.focus(), 0);
    codeCont.append(codeViewer.getElement());

    const dragNodes = $el.find('.drag-drawflow');
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

        const node = nodes.find(node => node.name === name);
        flowEditor.addNode(name, node.inputs, node.outputs, pos_x, pos_y, name, node.data, node.html);
    }

    /* Click events */
    $el.find('li').click(ev => {
        canvas.show();
        codeCont.hide();
        flowEditor.changeModule(ev.currentTarget.innerText.trim());
        changeModule(ev);
    });
    $el.find('.btn-export').click(ev => {
        canvas.hide();
        codeCont.show();
        codeViewer.setContent(JSON.stringify(flowEditor.export(), null, 4));
        //console.log('<pre><code>' + JSON.stringify(flowEditor.export(), null, 4) + '</code></pre>');
    });
    $el.find('.btn-clear').click(ev => {
        flowEditor.clearModuleSelected();
    });
    $el.find('#preview').click(ev => {
        const selected = $el.find('.menu ul li.selected');
        const code = compiler(flowEditor.export())[selected.text().trim() + '.js'] || '';
        canvas.hide();
        codeCont.show();
        codeViewer.setContent(code);
    });
    $el.find('#lock').click(ev => {
        flowEditor.editor_mode = 'fixed';
        changeMode('lock');
    });
    $el.find('#add').click(ev => {
        const name = $el.find('#name').val().trim();
        if (name !== '') {
            flowEditor.addModule(name);
            const tab = $(`<li>${name}</li>`);
            tab.click(ev => {
                canvas.show();
                codeCont.hide();
                flowEditor.changeModule(ev.currentTarget.innerText.trim());
                changeModule(ev);
            });
            $el.find('.menu ul').append(tab);
        }
    });
    $el.find('#delete').click(ev => {
        const selected = $el.find('.menu ul li.selected');
        if ($el.find(".menu ul li").length > 1) {
            flowEditor.removeModule(selected.text().trim());
            selected.remove();
            flowEditor.changeModule($el.find(".menu ul li").get(0).innerText.trim());
            $el.find(".menu ul li").get(0).classList.add('selected');
            setZoom();
        }
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

    function setZoom() {
        flowEditor.zoom_out();
        flowEditor.zoom_out();
        flowEditor.zoom_out();
    }

    function changeModule(event) {
        $el.find(".menu ul li").removeClass('selected');
        event.target.classList.add('selected');
        setZoom();
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

    return { $el, flowEditor, setZoom };
}