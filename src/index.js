import NetlifyDashboard from './netlify';
import commands from './commands';

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

      // On invalid token
      onInvalidToken: () => alert('No token in path, don\'t worry if you added token in config'),
    }, ...opts
  };

  // Init and add dashboard object to editor
  editor.NetlifyDashboard = new NetlifyDashboard(editor, options);

  // Add commands
  commands(editor, options);
};