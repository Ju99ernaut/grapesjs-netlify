export const nodes = [{
    name: 'event',
    label: 'Event',
    attributes: {
        class: 'fa fa-bell'
    },
    inputs: 0,
    outputs: 1,
    data: {
        script: 'const { {[events]} } = event;',
        events: 'path'
    },
    html: `<div>
        <div class="title-box"><i class="fa fa-bell"></i> Event</div>
        <div class="flow-box">
            <p>Event item</p>
            <select df-events>
                <option value="path">path</option>
                <option value="httpMethod">method</option>
                <option value="headers">headers</option>
                <option value="queryStringParameters">query</option>
                <option value="body">body</option>
                <option value="isBase64Encoded">Base64</option>
            </select>
        </div>
    </div>`
}, {
    name: 'context',
    label: 'Context',
    attributes: {
        class: 'fa fa-cube'
    },
    inputs: 0,
    outputs: 1,
    data: {
        script: 'const { {[context]} } = context;',
        context: ''
    },
    html: `<div>
        <div class="title-box"><i class="fa fa-cube"></i> Context</div>
        <div class="flow-box">
            <p>Request context</p>
            <input type="text" df-context placeholder="context"/>
        </div>
    </div>`
}, {
    name: 'env',
    label: 'Enviroment',
    attributes: {
        class: 'fa fa-key'
    },
    inputs: 0,
    outputs: 1,
    data: {
        script: 'const {[variable]} = process.env.{[variable]};',
        variable: ''
    },
    html: `<div>
        <div class="title-box"><i class="fa fa-key"></i> Enviroment</div>
        <div class="flow-box">
            <p>Enviroment variable</p>
            <input type="text" df-variable placeholder="ENV_VAR"/>
        </div>
    </div>`
}, {
    name: 'identity',
    label: 'Identity',
    attributes: {
        class: 'fa fa-user-circle'
    },
    inputs: 0,
    outputs: 1,
    data: {
        script: 'context.clientContext.user',
        user: 'loggedin'
    },
    html: `<div>
        <div class="title-box"><i class="fa fa-user-circle"></i> Identity</div>
        <div class="flow-box">
            <p>Fetch response</p>
            <select df-user>
                <option value="loggedin">Logged In</option>
                <option value="loggedout">Logged Out</option>
            </select>
        </div>
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
        script: 'const res = await fetch({[url]}, { method: {[method]}, ...{[input]} })',
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
        script: 'const data = await {[input]}.{[result]};',
        result: 'json()'
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
    data: {
        script: 'console.log({[input]})',
    },
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
        script: 'const template = `{[template]}`;',
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
    data: {
        script: 'return { status: {[status]}, ...{[input]} }',
        status: 200
    },
    html: `<div>
        <div class="title-box"><i class="fa fa-eject"></i> Return </div>
        <div class="flow-box">
            <p>Status code</p>
            <input type="number" df-status placeholder="200">
        </div>
    </div>`
}]