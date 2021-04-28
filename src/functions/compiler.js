export function functionsTemplate(code) {
    return `const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    ${code}
}`;
}

export default ({ drawflow }) => {
    const { keys } = Object;
    const files = keys(drawflow);
    const obj = {};
    files.forEach(file => {
        const nodes = keys(drawflow[file].data);
        let code = '';
        nodes.forEach(node => {
            const { script } = drawflow[file].data[node].data;
            code += script ? script + '\n    ' : '';
        });
        obj[file + '.js'] = functionsTemplate(code);
    })
    return obj
}