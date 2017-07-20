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
        withoutPagination: {
            type: Boolean,
            value: true
        }
    },
    observers: [
        '_routeConfig(routeData.view)'
    ],

    _routeConfig: function(view) {
        if (!this.route || !~this.route.prefix.indexOf('/partners')) { return; }
        if (view === 'list' && !this.isTpmUser()) {
            let queries = this._configListParams();
            this._setPartnersListQueries(queries);
            this.view = 'list';
        } else if (view === '' || _.isUndefined(view)) {
            this.set('route.path', '/list');
        } else if (!isNaN(+view)) {
            this.debounce('clearSearchQueries', () => {
                this.clearQueries();
            }, 100);
            this.partnerId = +view;
        }  else {
            this.fire('404');
        }
    },

    _configListParams: function() {
        let queriesUpdates = {},
            queries = this.parseQueries();

        if (!queries.ordering) { queriesUpdates.ordering = 'vendor_number'; }

        if (!this.lastParams) {
            this.lastParams = _.clone(queries);
        } else if (!_.isEqual(this.lastParams, queries)) {
            this.lastParams = _.clone(queries);
        }

        this.debounce('updateSearchQueries', () => {
            this.updateQueries(queriesUpdates, null);
        }, 100);
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
            }, 100);
        }
    },
    _setPartnersListQueries: function(queries) {
        if (!_.isEmpty(queries) && (!this.partnersListQueries || !_.isEqual(this.partnersListQueries, queries))) {
            this.partnersListQueries = queries;
        }
    }
});
