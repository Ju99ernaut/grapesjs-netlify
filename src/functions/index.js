import flowchart from './flowchart';

export default (editor, opts = {}) => {
    const mdl = editor.Modal;
    const cm = editor.Commands;
    const pfx = editor.getConfig('stylePrefix');
    const mdlClass = `${pfx}mdl-dialog-ntl`;
    const { $el, flowEditor, setZoom } = flowchart(editor, opts);

    setZoom();
    editor.NetlifyDashboard.flowEditor = flowEditor;

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