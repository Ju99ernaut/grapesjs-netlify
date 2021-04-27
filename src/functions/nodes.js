export const nodes = [{
    name: 'event',
    label: 'Event',
    attributes: {
        class: 'fa fa-bell'
    },
    inputs: 0,
    outputs: 1,
    data: {},
    html: `<div>
        <div class="title-box"><i class="fa fa-bell"></i> Event</div>
    </div>`
}, {
    name: 'context',
    label: 'Context',
    attributes: {
        class: 'fa fa-cube'
    },
    inputs: 0,
    outputs: 1,
    data: {},
    html: `<div>
        <div class="title-box"><i class="fa fa-cube"></i> Context</div>
    </div>`
}, {
    name: 'fetch',
    label: 'Fetch',
    attributes: {
        class: 'fa fa-spinner'
    },
    inputs: 0,
    outputs: 1,
    data: {
        method: 'get',
        url: ''
    },
    html: `<div>
        <div class="title-box"><i class="fa fa-paper-plane"></i> Fetch</div>
        <div class="flow-box">
            <p>Send fetch request</p>
            <p>select method</p>
            <select df-method>
                <option value="get">GET</option>
                <option value="post">POST</option>
                <option value="put">PUT</option>
                <option value="patch">PATCH</option>
                <option value="delete">DELETE</option>
            </select>
            <p>Enter url</p>
            <input type="text" df-url placeholder="https://...">
        </div>
    </div>`
}, {
    name: 'fetch-res',
    label: 'Fetch Response',
    attributes: {
        class: 'fa fa-spinner'
    },
    inputs: 1,
    outputs: 1,
    data: {
        result: 'json()',
    },
    html: `<div>
        <div class="title-box"><i class="fa fa-paper-plane"></i> Response</div>
        <div class="flow-box">
            <p>Fetch response</p>
            <select df-result>
                <option value="json()">json</option>
                <option value="text()">text</option>
                <option value="blob()">blob</option>
                <option value="formData()">form</option>
                <option value="arrayBuffer()">buffer</option>
                <option value="status">status</option>
                <option value="ok">ok</option>
                <option value="statusText">statusText</option>
            </select>
        </div>
    </div>`
}, {
    name: 'log',
    label: 'Log',
    attributes: {
        class: 'fa fa-file-text'
    },
    inputs: 1,
    outputs: 0,
    data: {},
    html: `<div>
        <div class="title-box"><i class="fa fa-file-text"></i> Save log file </div>
    </div>`
}, {
    name: 'template',
    label: 'Template',
    attributes: {
        class: 'fa fa-code'
    },
    inputs: 1,
    outputs: 1,
    data: {
        template: 'Write your template'
    },
    html: `<div>
        <div class="title-box"><i class="fa fa-code"></i> Template</div>
        <div class="flow-box">
            Ger Vars
            <textarea df-template></textarea>
            Output template with vars
        </div>
    </div>`
}, {
    name: 'out',
    label: 'Out',
    attributes: {
        class: 'fa fa-eject'
    },
    inputs: 1,
    outputs: 0,
    data: {},
    html: `<div>
        <div class="title-box"><i class="fa fa-eject"></i> Return </div>
    </div>`
}]