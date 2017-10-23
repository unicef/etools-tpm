Polymer({

    is: 'app-shell',

    behaviors: [
        etoolsBehaviors.LoadingBehavior,
        Polymer.IronScrollTargetBehavior,
        TPMBehaviors.UserController,
        etoolsAppConfig.globals
    ],

    properties: {
        sidebarOpened: {
            type: Boolean,
            value: true
        },

        page: {
            type: String,
            reflectToAttribute: true,
            observer: '_pageChanged'
        },

        narrow: {
            type: Boolean,
            reflectToAttribute: true
        },

        _toast: {
            type: Object,
            value: null
        },

        _toastQueue: {
            type: Array,
            value: function() {
                return [];
            }
        },
        globalLoadingQueue: {
            type: Array,
            value: function() {return [];}
        }
    },

    observers: [
        '_routePageChanged(route.path)'
    ],

    listeners: {
        'global-loading': '_handleGlobalLoading',
        'toast': 'queueToast',
        'drawer-toggle-tap': 'toggleDrawer',
        '404': '_pageNotFound',
        'initial-data-loaded': '_initialDataLoaded'
    },

    ready: function() {
        this.baseUrl = this.basePath;
        this.fire('global-loading', {message: 'Loading...', active: true, type: 'initialisation'});
    },

    attached: function() {
        if (this.initLoadingComplete && this.route.path === '/tpm/') {
            this._configPath();
        }

        this.$.drawer.$.scrim.remove();
    },

    toggleDrawer: function() {
        this.sidebarOpened = !this.sidebarOpened;

        this.$.layout.toggleAttribute('opened', this.sidebarOpened);
        this.$.drawer.toggleAttribute('opened', this.sidebarOpened);
        this.$.appSidebar.toggleAttribute('opened', this.sidebarOpened);
        this.$.drawer.updateStyles();
    },

    queueToast: function(e, detail) {
        let notificationList = Polymer.dom(this.root).querySelector('multi-notification-list');
        if (notificationList && detail) {
            notificationList.fire('notification-push', detail);
        }
    },

    _routePageChanged: function() {
        if (!this.initLoadingComplete || !this.routeData.page) { return; }
        this.page = this.routeData.page || 'partners';
        this.scroll(0, 0);
    },

    _pageChanged: function(page) {
        if (Polymer.isInstance(this.$[`${page}`])) { return; }
        this.fire('global-loading', {message: 'Loading...', active: true, type: 'initialisation'});

        var resolvedPageUrl;
        if (page === 'not-found') {
            resolvedPageUrl = 'elements/pages/not-found-page-view/not-found-page-view.html';
        } else {
            resolvedPageUrl = `elements/pages/${page}-page-components/${page}-page-main/${page}-page-main.html`;
            if (page === 'partners' && !this.isTpmUser()) {
                let url = 'elements/pages/partners-page-components/partners-list-view/partners-list-view.html';
                this.importHref(url, null, null, true);
            }
        }
        this.importHref(resolvedPageUrl, () => {
            if (!this.initLoadingComplete) { this.initLoadingComplete = true; }
            this.fire('global-loading', {type: 'initialisation'});
            if (this.route.path === '/tpm/') { this._configPath(); }
        }, this._pageNotFound, true);
    },

    _pageNotFound: function(event) {
        this.page = 'not-found';
        let message = event && event.detail && event.detail.message ?
            `${event.detail.message}` :
            'Oops you hit a 404!';

        this.fire('toast', {text: message});
    },

    _initialDataLoaded: function(e) {
        if (e && e.type === 'initial-data-loaded') { this.initialDataLoaded = true; }
        if (this.routeData && this.initialDataLoaded) {
            this.user = this.getUserData();
            this.page = this.routeData.page || this._configPath();
        }
    },

    _handleGlobalLoading: function(event) {
        if (!event.detail || !event.detail.type) {
            console.error('Bad details object', JSON.stringify(event.detail));
            return;
        }
        let loadingElement =  this.$['global-loading'];

        if (event.detail.active && loadingElement.active) {
            this.globalLoadingQueue.push(event);
        } else if (event.detail.active && typeof event.detail.message === 'string' && event.detail.message !== '') {
            loadingElement.loadingText = event.detail.message;
            loadingElement.active = true;
            loadingElement.type = event.detail.type;
        } else {
            if (loadingElement.type === event.detail.type) { loadingElement.active = false; }
            this.globalLoadingQueue = this.globalLoadingQueue.filter((element) => {return element.detail.type !== event.detail.type;});
            if (this.globalLoadingQueue.length) {
                this._handleGlobalLoading(this.globalLoadingQueue.shift());
            }
        }
    },

    _configPath: function() {
        let path = this.isTpmUser() ? `partners/${this.getPartnerId()}/details` : 'partners/list';
        this.set('route.path', `${this.basePath}${path}`);
        return 'partners';
    }

});
