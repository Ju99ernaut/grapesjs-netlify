export default (editor, opts = {}) => {
    const mdl = editor.Modal;
    const pfx = editor.getConfig('stylePrefix');
    const mdlClass = `${pfx}mdl-dialog-ntl`;

    editor.Commands.add('netlify-dashboard', {
        run(editor, sender) {
            const mdlDialog = document.querySelector(`.${pfx}mdl-dialog`);
            mdlDialog.classList.add(mdlClass);
            sender?.set && sender.set('active');
            mdl.setTitle(opts.mdlTitle);
            mdl.setContent(editor.NetlifyDashboard.render());
            mdl.open();
            mdl.getModel().once('change:open', () => {
                mdlDialog.classList.remove(mdlClass);
            });
        }
    });
}