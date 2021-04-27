import NetlifyDashboard from './netlify';
import commands from './commands';
import functions from './functions';

export default (editor, opts = {}) => {
  const options = {
    ...{
      // default options
      // Netlify auth token
      token: '',

      // Modal title
      mdlTitle: 'Netlify Dashboard',

      // Auth url
      authUrl: '/.netlify/functions/auth-start',

      // Loader element
      loader: '',

      // No deploys element
      nodeploys: '',

      // On invalid token
      onInvalidToken() {
        alert('No token in path, don\'t worry if you added token in config');
      },

      // On deploy succes
      onDeploy(deploy) {
        alert(`Successful deployment\n${deploy.url}`);
      },

      // On deploy error
      onDeployErr(err) {
        alert('Deployment failed');
        console.log(err);
      },

      // Opts for code export
      addExportBtn: true,
      btnLabel: 'Export to Zip',
      filenamePfx: 'grapesjs_template',
      filename: null,
      root: {
        functions: {
          '.env': '',
          'package.json': ''
        },
        css: {
          'style.css': ed => ed.getCss(),
        },
        'package.json': '',
        'netlify.toml': '',
        'index.html': ed =>
          `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8"/>
          <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <meta name="description" content="Site built using grapesjs editor">
          <link rel="stylesheet" href="./css/style.css"/>
          <title>Grapesjs Site</title>
        </head>
        <body>
          ${ed.getHtml()}
        </body>
        </html>`
      },
      isBinary: null,
    }, ...opts
  };

  // Init and add dashboard object to editor
  editor.NetlifyDashboard = new NetlifyDashboard(editor, options);

  // Add commands
  commands(editor, options);
  // Add functions
  window.Drawflow && functions(editor, options);
};