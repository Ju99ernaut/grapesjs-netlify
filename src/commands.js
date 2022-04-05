import JSZip from 'jszip';
import FileSaver from 'file-saver';

export default (editor, opts = {}) => {
    const mdl = editor.Modal;
    const cm = editor.Commands;
    const pfx = editor.getConfig('stylePrefix');
    const mdlClass = `${pfx}mdl-dialog-ntl`;
    const btnExp = editor.$(`<button class="${pfx}btn-prim">${opts.btnLabel}</button>`);
    const cmdExport = 'gjs-export-zip';

    cm.add('netlify-dashboard', {
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

    cm.add(cmdExport, {
        createFile(zip, name, content) {
            const options = {};
            const ext = name.split('.')[1];
            const isBinary = opts.isBinary ?
                opts.isBinary(content, name) :
                !(ext && ['html', 'css'].indexOf(ext) >= 0) &&
                !/^[\x00-\x7F]*$/.test(content);

            if (isBinary) {
                options.binary = true;
            }

            editor.log(['Create file', { name, content, options }],
                { ns: 'plugin-export' });

            zip.file(name, content, options);
        },

        async createDirectory(zip, root) {
            root = typeof root === 'function' ? await root(editor) : root;

            for (const name in root) {
                if (root.hasOwnProperty(name)) {
                    let content = root[name];
                    content = typeof content === 'function' ? await content(editor) : content;
                    const typeOf = typeof content;

                    if (typeOf === 'string') {
                        this.createFile(zip, name, content);
                    } else if (typeOf === 'object') {
                        const dirRoot = zip.folder(name);
                        await this.createDirectory(dirRoot, content);
                    }
                }
            }
        },

        run(editor, sender, options = {}) {
            const zip = new JSZip();
            const { save, clb } = options;
            opts.onGenerateAsyn(this.createDirectory(zip, opts.root)
                .then(() => {
                    zip.generateAsync({ type: 'blob' })
                        .then(content => {
                            const filenameFn = opts.filename
                            let filename = filenameFn ? filenameFn(editor) :
                                `${opts.filenamePfx}_${Date.now()}.zip`;
                            save && FileSaver.saveAs(content, filename);
                            clb && typeof clb === 'function' && clb(content, filename);
                        });
                })
            )
        }
    });

    if (opts.addExportBtn) {
        editor.on('run:export-template', () => {
            mdl.getContentEl().appendChild(btnExp.get(0));
            btnExp.on('click', () => editor.runCommand(cmdExport, { save: true }));
        });
    }
}