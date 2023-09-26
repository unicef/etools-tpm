'use strict';

Polymer({
    is: 'partners-page-main',

    behaviors: [
        TPMBehaviors.QueryParamsController,
        TPMBehaviors.UserController,
        TPMBehaviors.PermissionController
    ],

    properties: {
        queryParams: {
            type: Object,
            notify: true,
            observer: '_queryParamsChanged'
        },
        initiation: {
            type: Number,
            value: 0
        },
        withoutPagination: {
            type: Boolean,
            value: true
        },
        visitDetails: Object,
        originalData: {
            type: Object,
            readOnly: true,
            value: function() {
                return {};
            }
        }
    },

    observers: [
        '_routeConfig(routeData.view)'
    ],

    _routeConfig: function(view) {
        if (!this.route || !~this.route.prefix.indexOf('/partners')) {
            this.resetLastView();
            return;
        }
        if (this.lastView === view) { return; }

        if (view === 'list' && !this.isTpmUser()) {
            let queries = this._configListParams(this.initiation++);
            this._setPartnersListQueries(queries);
            this.view = 'list';
        } else if (!isNaN(+view)) {
            this.debounce('clearSearchQueries', () => {
                this.clearQueries();
            });
            this.partnerId = +view;
        } else if (view === '' || _.isUndefined(view)) {
            this.set('route.path', '/list');
        }  else {
            this.clearQueries();
            this.fire('404');
        }

        if (view !== this.lastView) {
            this.fire('toast', {reset: true});
        }
        this.lastView = view;
    },

    getLink: function getLink() {
      return window.location.origin + '/fm/partners';
    },

    resetLastView: function() {
        if (this.lastView) { this.lastView = null; }
    },

    _configListParams: function(noNotify) {
        let queriesUpdates = {},
            queries = this.parseQueries();

        if (!queries.page_size) { queriesUpdates.page_size = '10'; }
        if (!queries.ordering) { queriesUpdates.ordering = 'vendor_number'; }
        if (!queries.page) { queriesUpdates.page = '1'; }

        let page = +queries.page;
        if (isNaN(page) || (this.lastParams && (queries.page_size !== this.lastParams.page_size || queries.ordering !== this.lastParams.ordering))) {
            queriesUpdates.page = '1';
        }

        if (!this.lastParams || !_.isEqual(this.lastParams, queries)) {
            this.lastParams = _.clone(queries);
        }

        this.updateQueries(queriesUpdates, null, noNotify);
        return this.parseQueries();
    },

    _queryParamsChanged: function() {
        if (!~this.route.prefix.indexOf('/partners') || !this.routeData) { return; }
        if (this.routeData.view === 'list') {
            let queries = this._configListParams();
            this._setPartnersListQueries(queries);
        } else if (!isNaN(+this.routeData.view)) {
            this.debounce('clearSearchQueries', () => {
                this.clearQueries();
            });
        }
    },

    _setPartnersListQueries: function(queries) {
        if (!_.isEmpty(queries) && (!this.partnersListQueries || !_.isEqual(this.partnersListQueries, queries))) {
            this.partnersListQueries = queries;
        }
    }
});
