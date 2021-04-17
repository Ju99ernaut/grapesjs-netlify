import flowchart from './flowchart';

export default (editor, opts = {}) => {
    const mdl = editor.Modal;
    const cm = editor.Commands;
    const pfx = editor.getConfig('stylePrefix');
    const mdlClass = `${pfx}mdl-dialog-ntl`;

    cm.add('netlify-functions', {
        run(editor, sender) {
            const mdlDialog = document.querySelector(`.${pfx}mdl-dialog`);
            mdlDialog.classList.add(mdlClass);
            sender?.set && sender.set('active');
            mdl.setTitle(opts.mdlTitle);
            const { $el, flowEditor } = flowchart(editor, opts)
            mdl.setContent($el);
            mdl.open();
            flowEditor.changeModule('Home');
            mdl.getModel().once('change:open', () => {
                mdlDialog.classList.remove(mdlClass);
            });
        }
    });
}