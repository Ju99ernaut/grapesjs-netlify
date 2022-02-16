//import { NetlifyAPI } from 'netlify';
import api from './utils/openApi';
import timeAgo from 'time-ago';
import { csrfToken, parseHash, removeHash } from './utils/auth';
import {
    sortByDate,
    sortByPublishDate,
    sortByName,
    sortByFunctions,
    sortByRepo,
    matchText
} from './utils/sort';

export default class NetlifyDashboard {
    constructor(editor, opts = {}) {
        this.editor = editor;
        this.opts = opts;
        this.$ = editor.$;
        this.onRender = this.onRender.bind(this);

        const response = parseHash(window.location.hash);
        /* Clear hash */
        removeHash();

        /* Protect against csrf (cross site request forgery https://bit.ly/1V1AvZD) */
        if (response.token && !localStorage.getItem(response.csrf)) {
            opts.onInvalidToken(editor);
        }

        /* Clean up csrfToken */
        localStorage.removeItem(response.csrf);

        /* Set initial app state */
        this.state = {
            projectId: '',
            user: response,
            sites: [],
            filterText: '',
            loading: false,
            sortBy: 'published_at',
            sortOrder: 'desc'
        };

        /* Use opts token if available */
        this.getUser(response, this.opts.token);
    }

    setState(state) {
        this.state = { ...this.state, ...state };
        this.update();
    }

    setStateSilent(state) {
        this.state = { ...this.state, ...state };
    }

    async getUser(response, token) {
        if (!response.token && token) {
            const user = await api(token, 'users');
            user[0].token = btoa(this.opts.token);
            this.setState({ user: user[0] });
        }
    }

    async onRender() {
        const { user } = this.state;
        if (!user.token) return;

        /* Set request loading state */
        this.setState({
            loading: true
        });

        /* Fetch sites from netlify API */
        const sites = await api(window.atob(user.token), 'sites', {
            filter: 'all'
        });

        /* Set sites and turn off loading state */
        this.setState({
            user,
            sites,
            loading: false
        });
    }

    deploy = () => {
        const { projectId, user } = this.state;
        const { editor, opts } = this;
        const clb = (content, filename) => {
            let url;
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/zip',
                    Authorization: `Bearer ${window.atob(user.token)}`
                },
                body: content
            };
            if (projectId) url = `sites/${projectId}/deploys`;
            else url = `sites`;
            api('', url, {}, options)
                .then(res => {
                    opts.onDeploy(res, editor);
                    console.log('deploy: ', res);
                })
                .catch(err => opts.onDeployErr(err, editor));
        }
        editor.runCommand('gjs-export-zip', { save: false, clb });
    }

    handleAuth = e => {
        e.preventDefault();
        const state = csrfToken();
        const { location, localStorage } = window;
        /* Set csrf token */
        localStorage.setItem(state, 'true');
        /* Do redirect */
        const redirectTo = `${location.origin}${location.pathname}`;
        window.location.href = `${this.opts.authUrl}?url=${redirectTo}&csrf=${state}`;
    }

    handleLogout = e => {
        e.preventDefault();
        window.location.href = `${location.origin}${location.pathname}`;
    }

    handleFilterInput = e => {
        this.setState({
            filterText: e.target.value
        });
    }

    handleSort = e => {
        const { sortOrder } = this.state;
        if (e.target && e.target.dataset) {
            this.setState({
                sortBy: e.target.dataset.sort,
                // invert sort order
                sortOrder: sortOrder === 'desc' ? 'asc' : 'desc'
            });
        }
    }

    renderSiteList() {
        const { sites, filterText, loading, sortBy, sortOrder } = this.state;
        const { opts, editor } = this;

        if (loading) return opts.loader || `<div>Loading sites...</div>`;

        if (!sites.length) return opts.nodeploys || `<div>No deploys</div>`;

        let order
        if (sortBy === 'published_at') {
            order = sortByPublishDate(sortOrder);
        } else if (sortBy === 'name' || sortBy === 'account_name') {
            order = sortByName(sortBy, sortOrder);
        } else if (sortBy === 'updated_at' || sortBy === 'created_at') {
            order = sortByDate(sortBy, sortOrder);
        } else if (sortBy === 'functions') {
            order = sortByFunctions(sortOrder);
        } else if (sortBy === 'repo') {
            order = sortByRepo(sortOrder);
        }

        const sortedSites = sites.sort(order);

        let matchingSites = sortedSites.filter(site => {
            // No search query. Show all
            if (!filterText) {
                return true;
            }

            const { name, site_id, ssl_url, build_settings } = site;
            if (
                matchText(filterText, name) ||
                matchText(filterText, site_id) ||
                matchText(filterText, ssl_url)
            ) {
                return true;
            }

            // Matches repo url
            if (
                build_settings &&
                build_settings.repo_url &&
                matchText(filterText, build_settings.repo_url)
            ) {
                return true;
            }

            // no match!
            return false;
        })
            .map((site, i) => {
                const {
                    name,
                    account_name,
                    account_slug,
                    admin_url,
                    ssl_url,
                    screenshot_url,
                    created_at
                } = site;
                const published_deploy = site.published_deploy || {};
                const functions = published_deploy.available_functions || [];
                const functionsNames = functions.map(func => func.n).join(', ');
                const build_settings = site.build_settings || {};
                const { repo_url } = build_settings;
                const time = published_deploy.published_at ? timeAgo.ago(new Date(published_deploy.published_at).getTime()) : 'NA';
                const createdAt = created_at ? timeAgo.ago(new Date(created_at).getTime()) : 'NA';
                return `<div class="site-wrapper" key="${i}" data-id="${site.id}" title="${editor.I18n.t('grapesjs-netlify.titles.deploy')}">
                        <div class="site-screenshot">
                            <a href="${admin_url}" target="_blank" rel="noopener noreferrer">
                                <img src="${screenshot_url}" alt="" />
                            </a>
                        </div>
                        <div class="site-info">
                            <h2>
                                <a href="${admin_url}" target="_blank" rel="noopener noreferrer">
                                    ${name}
                                </a>
                            </h2>
                            <div class="site-meta">
                                <a href="${ssl_url}" target="_blank" rel="noopener noreferrer">
                                    ${ssl_url}
                                </a>
                            </div>
                        </div>
                        <div class="site-team">
                            <a
                                href="https://app.netlify.com/teams/${account_slug}/sites/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ${account_name}
                            </a>
                        </div>
                        <div class="site-publish-time">${time}</div>
                        <div class="site-functions">
                            <div title="${functionsNames}">
                                <a
                                    href="${admin_url}/functions"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    ${functions.length}
                                </a>
                            </div>
                        </div>
                        <div class="site-create-time">${createdAt}</div>
                        <div class="site-repo-link">
                            ${repo_url ? `
                                <a href="${repo_url}" target="_blank" rel="noopener noreferrer">
                                    ${repo_url.replace(/^https:\/\//, '')}
                                </a>
                            ` : ''}
                        </div>
                    </div>`;
            }).join('\n');

        if (!matchingSites.length) {
            matchingSites = `<div>
                    <h3>
                        No '${filterText}' examples found. Clear your search and try again.
                    </h3>
                </div>`;
        }
        return matchingSites;
    }

    update() {
        this.$el?.find('#site-list').html(this.renderSiteList());
        const sites = this.$el?.find('.site-wrapper');
        this.setStateSilent({ projectId: '' });
        if (sites) {
            sites.on('click', e => {
                sites.removeClass('selected');
                this.$(e.currentTarget).addClass('selected');
                this.setStateSilent({ projectId: e.currentTarget.dataset.id });
            });
        }
    }

    render() {
        const { user } = this.state;
        const { $, editor } = this;

        // Do stuff on render
        this.onRender();
        this.$el?.remove();

        /* Not logged in. Show login button */
        if (user && !user.token) {
            const login = $(`<div class="app">
                    <div id="login">
                        <button title="${editor.I18n.t('grapesjs-netlify.titles.login')}" >
                            <svg class="login-button" width="173" height="40" viewBox="0 0 173 40"><defs><rect id="a" width="173" height="40" rx="4"/></defs><g fill="none" fill-rule="evenodd"><mask id="b" fill="#fff"><use xlink:href="#a"/></mask><g fill="#00AD9F" mask="url(#b)"><path d="M0 0h173v40H0z"/></g><path fill="#FFF" fill-rule="nonzero" d="M39.2 24.4h5.2V26h-7.2V14.6h2v9.8zm6.1-2.7c0-.8.2-1.6.5-2.2.4-.7.8-1.2 1.4-1.6.6-.3 1.3-.5 2-.5 1.2 0 2.1.4 2.8 1 .8.8 1.1 1.8 1.2 3v.5a5 5 0 0 1-.5 2.2c-.3.7-.8 1.2-1.4 1.5a4 4 0 0 1-2 .6c-1.2 0-2.2-.4-2.9-1.2-.7-.8-1-1.9-1-3.2v-.1zm2 .2c0 .8.1 1.5.5 2 .3.5.8.7 1.5.7.6 0 1.1-.2 1.5-.7.3-.5.5-1.2.5-2.2 0-.9-.2-1.5-.5-2-.4-.5-1-.8-1.5-.8-.7 0-1.2.3-1.5.8-.4.4-.6 1.2-.6 2.2zm7.2-.2a5 5 0 0 1 .9-3.1 3 3 0 0 1 2.5-1.2c1 0 1.7.3 2.2 1l.1-.9H62v8.2c0 1.2-.3 2-1 2.7a4 4 0 0 1-2.8 1c-.6 0-1.2-.2-1.8-.5-.6-.2-1-.6-1.4-1l1-1.1c.5.7 1.2 1 2 1 .7 0 1.2-.1 1.6-.5.3-.3.5-.8.5-1.5v-.6c-.5.7-1.2 1-2.2 1a3 3 0 0 1-2.4-1.2c-.6-.8-1-1.9-1-3.3zm1.9.2c0 .8.1 1.5.5 2 .3.5.8.7 1.4.7.8 0 1.4-.3 1.7-1V20c-.3-.6-.9-1-1.7-1-.6 0-1 .3-1.4.8-.4.5-.5 1.2-.5 2.2zm9.5 4.1H64v-8.5h1.9V26zm-2-10.6c0-.3 0-.6.3-.8.1-.2.4-.3.7-.3.4 0 .7.1.8.3.2.2.3.5.3.8 0 .2 0 .5-.3.7-.1.2-.4.3-.8.3-.3 0-.6-.1-.7-.3a1 1 0 0 1-.3-.7zm5.8 2.1v1a3 3 0 0 1 2.5-1.1c1.8 0 2.7 1 2.7 3V26H73v-5.5c0-.5 0-1-.3-1.2-.3-.2-.6-.4-1.2-.4-.7 0-1.3.4-1.7 1V26H68v-8.5h1.8zm18.6 5.9l1.3-5.9h1.9L89.2 26h-1.6l-1.8-5.8L84 26h-1.6l-2.3-8.5H82l1.3 5.8 1.8-5.8h1.4l1.8 5.9zm6.5 2.6h-2v-8.5h2V26zm-2-10.6c0-.3 0-.6.2-.8.2-.2.5-.3.8-.3.4 0 .6.1.8.3.2.2.3.5.3.8 0 .2-.1.5-.3.7-.2.2-.4.3-.8.3-.3 0-.6-.1-.8-.3a1 1 0 0 1-.3-.7zm6.4 0v2.1h1.5V19h-1.5v4.7c0 .3 0 .5.2.7.1.1.3.2.7.2h.6V26l-1.2.2c-1.5 0-2.2-.8-2.2-2.5V19h-1.4v-1.5h1.4v-2h1.9zm4.8 3a3 3 0 0 1 2.4-1c1.8 0 2.7 1 2.7 3V26h-1.9v-5.5c0-.5-.1-1-.4-1.2-.2-.2-.6-.4-1-.4-.8 0-1.4.4-1.8 1V26h-1.9V14h2v4.5zm20.2 7.6h-2l-5-8v8h-2V14.6h2l5 8.1v-8h2V26zm5.9.2a4 4 0 0 1-3-1.2 4.1 4.1 0 0 1-1-3v-.2c0-.9.1-1.6.4-2.3.4-.7.8-1.2 1.4-1.6.6-.3 1.2-.5 2-.5 1.1 0 2 .4 2.6 1 .7.8 1 1.9 1 3.2v.8H128c0 .7.2 1.2.7 1.6.4.4.9.6 1.5.6.9 0 1.6-.3 2.1-1l1 1c-.3.5-.7.9-1.3 1.1-.6.3-1.2.5-2 .5zm-.2-7.3c-.6 0-1 .2-1.3.6-.3.3-.5.8-.6 1.5h3.6v-.2c0-.6-.2-1-.5-1.4-.3-.3-.7-.5-1.2-.5zm7.4-3.4v2h1.5V19h-1.5v4.7l.2.7.7.2h.7V26l-1.3.2c-1.4 0-2.2-.8-2.2-2.5V19H134v-1.5h1.4v-2h2zm5 10.5h-2V14h2v12zm4 0h-1.8v-8.5h1.9V26zm-2-10.6c0-.3.2-.6.3-.8.2-.2.5-.3.8-.3.4 0 .6.1.8.3.2.2.3.5.3.8 0 .2 0 .5-.3.7-.2.2-.4.3-.8.3-.3 0-.6-.1-.8-.3a1 1 0 0 1-.2-.7zm4.8 10.6v-7h-1.3v-1.5h1.3v-.7c0-1 .3-1.7.8-2.2a3 3 0 0 1 2.2-.8c.3 0 .7 0 1 .2v1.5l-.7-.1c-1 0-1.4.5-1.4 1.4v.7h1.7V19H151v7h-1.9zm8-2.7l1.7-5.8h2l-3.3 9.8c-.6 1.4-1.4 2.1-2.7 2.1l-.9-.1v-1.5h.4c.5 0 .8 0 1-.2.3-.2.5-.5.6-1l.3-.6-3-8.5h2l1.9 5.8zM22.3 17l.3-2.4 1.9 1.9-2 .8-.2-.2zm2.6 0l2 1.9c.4.4.6.6.6.8v.1l-4.6-2 2-.9zm2.6 3.4l-.6.7-2.2 2.2-2.8-.6h-.1l-.3-.6.5-3.3c.3-.1.5-.2.6-.4l4.9 2zm-3.3 3.4l-3.6 3.6.6-3.8c.2 0 .3-.2.4-.3l2.6.5zm-4.4 4.4l-.4.4L15 22V22h.1l5 1c.1.3.3.5.6.6l-.8 4.6zm-.8.8c-.3.3-.5.5-.7.5a1 1 0 0 1-.6 0c-.2 0-.4-.2-.8-.6l-4.5-4.5 1.1-1.9h.1a1.2 1.2 0 0 0 .8 0L19 29zm-7-5l-1.1-1.1 2-.9h.1v.2l-1 1.7zm-1.6-1.6l-1.3-1.3-.5-.5 4 .8v.1l-2.2 1zm-2-2.5v-.2l.7-.8 1.7-1.7a1087.8 1087.8 0 0 0 2.3 3.3 1.4 1.4 0 0 0-.2.4l-4.5-1zm2.9-3.2l2.2-2.2 1.7.7a286 286 0 0 1 1.1.8c0 .2.1.5.3.7l-2.3 3.6h-.6l-2.4-3.6zM14 14l2.9-2.9c.4-.4.6-.6.8-.6h.6c.2 0 .4.2.8.6l.7.7-2.1 3.2h-.4a1 1 0 0 0-.6.2L14 14zm6.2-1.8l2 2-.5 2.8a1 1 0 0 0-.4.2l-3-1.3a1.1 1.1 0 0 0-.1-.5l2-3.2zm-2 4.3l2.8 1.2v.2l-6.1 2.7v-.1L17 17h.2a1 1 0 0 0 .9-.5zm-3 4.6l6-2.6h.2v.1l-.5 3.2v.1c-.3 0-.6.2-.7.4H20l-4.9-1v-.2z"/></g></svg>
                        </button>
                    </div>
                </div>`);
            login.find('button').on('click', this.handleAuth);
            this.$el = login;
            return login;
        }

        /* Show admin UI */
        const cont = $(`<div class="app">
                <h1>
                    <span class="title-inner">
                        Hi ${user.full_name || editor.I18n.t('grapesjs-netlify.friend')}
                        <button id="logout" class="primary-button">
                            ${editor.I18n.t('grapesjs-netlify.logout')}
                        </button>
                    </span>
                </h1>
                ${user.avatar_url ? `<img class="avatar" src="${user.avatar_url}" alt="avatar"/>` : ''}
                <div class="contents">
                    <div class="flex-row">
                        <input
                            class="search"
                            placeholder="${editor.I18n.t('grapesjs-netlify.search')}"
                        />
                        <button id="deploy" class="primary-button">
                            ${editor.I18n.t('grapesjs-netlify.deploy')}
                        </button>
                    </div>
                    <div class="site-wrapper-header">
                        <div
                            class="site-screenshot-header header"
                            data-sort="name"
                            title="${editor.I18n.t('grapesjs-netlify.titles.info')}"
                        >
                            ${editor.I18n.t('grapesjs-netlify.info')}
                        </div>
                        <div
                            class="site-info header"
                            data-sort="name"
                        ></div>
                        <div
                            class="site-team header"
                            data-sort="account_name"
                            title="${editor.I18n.t('grapesjs-netlify.titles.team')}"
                        >
                            ${editor.I18n.t('grapesjs-netlify.team')}
                        </div>
                        <div
                            class="site-publish-time header"
                            data-sort="published_at"
                            title="${editor.I18n.t('grapesjs-netlify.titles.published')}"
                        >
                            ${editor.I18n.t('grapesjs-netlify.published')}
                        </div>
                        <div
                            class="site-functions header"
                            data-sort="functions"
                            title="${editor.I18n.t('grapesjs-netlify.titles.functions')}"
                        >
                            ${editor.I18n.t('grapesjs-netlify.functions')}
                        </div>
                        <div
                            class="site-create-time header"
                            data-sort="created_at"
                            title="${editor.I18n.t('grapesjs-netlify.titles.created')}"
                        >
                            ${editor.I18n.t('grapesjs-netlify.created')}
                        </div>
                        <div
                            class="site-repo-link header"
                            data-sort="repo"
                            title="${editor.I18n.t('grapesjs-netlify.titles.repo')}"
                        >
                            ${editor.I18n.t('grapesjs-netlify.repo')}
                        </div>
                    </div>
                    <div id="site-list">
                        ${this.renderSiteList()}
                    </div>
                </div>
            </div>`);
        cont.find('#logout').on('click', this.handleLogout);
        cont.find('#deploy').on('click', this.deploy);
        cont.find('input').on('change', this.handleFilterInput);
        cont.find('.header').on('click', this.handleSort);

        this.$el = cont;
        return cont;
    }
}