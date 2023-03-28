import flowchart from './flowchart';
import compiler from './compiler';

export default (editor, opts = {}) => {
    const mdl = editor.Modal;
    const cm = editor.Commands;
    const pfx = editor.getConfig('stylePrefix');
    const mdlClass = `${pfx}mdl-dialog-ntl`;
    const { $el, flowEditor, setZoom } = flowchart(editor, opts);
    const { keys } = Object;

    setZoom();
    editor.NetlifyDashboard.flowEditor = flowEditor;
    editor.NetlifyDashboard.env = {};
    editor.NetlifyDashboard.setEnv = (env) => {
        editor.NetlifyDashboard.env = { ...editor.NetlifyDashboard.env, ...env };
    };
    editor.NetlifyDashboard.getEnv = () => editor.NetlifyDashboard.env;
    editor.NetlifyDashboard.getDotEnv = () => {
        let file = ''
        keys(editor.NetlifyDashboard.env).forEach(env => {
            file += `${env}=${editor.NetlifyDashboard.env[env]} \n`;
        });
        return file;
    }
    editor.getFunctions = () => {
        return {
            '.env': editor.NetlifyDashboard.getDotEnv(),
            'package.json': '{"name":"backend-functions","version":"0.1.0","private":true,"dependencies":{"node-fetch":"^2.3.0"}}',
            ...compiler(flowEditor.export())
        }
    };

    cm.add('netlify-functions', {
        run(editor, sender) {
            const mdlDialog = document.querySelector(`.${pfx}mdl-dialog`);
            mdlDialog.classList.add(mdlClass);
            sender?.set && sender.set('active');
            mdl.setTitle(opts.mdlTitle);
            mdl.setContent($el);
            mdl.open();
            mdl.getModel().once('change:open', () => {
                mdlDialog.classList.remove(mdlClass);
            });
        }
    });
}