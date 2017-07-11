'use strict';

Polymer({
    is: 'visits-page-main',
    behaviors: [
        TPMBehaviors.QueryParamsController
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
        },
        visitDetails: Object
    },
    observers: [
        '_routeConfig(route)'
    ],

    _routeConfig: function(route) {
        if (this.route && !~this.route.prefix.indexOf('/visits')) { return; }
        let view = this.routeData ? this.routeData.view : route.path.split('/')[1];
        if (view === 'list') {
            let queries = this._configListParams();
            this._setVisitsListQueries(queries);
            this.view = 'list';
        } else if (!isNaN(+view)) {
            this.debounce('clearSearchQueries', () => {
                this.clearQueries();
            }, 100);
            this.visitId = +view;
        } else {
            this.fire('404');
        }
    },
    _configListParams: function() {
        let queriesUpdates = {},
            queries = this.parseQueries();

        if (!queries.ordering) { queriesUpdates.ordering = 'reference_number'; }

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
        if (!~this.route.prefix.indexOf('/visits') || !this.routeData) { return; }
        if (this.routeData.view === 'list') {
            let queries = this._configListParams();
            this._setVisitsListQueries(queries);
        } else if (!isNaN(+this.routeData.view)) {
            this.debounce('clearSearchQueries', () => {
                this.clearQueries();
            }, 100);
        }
    },
    _setVisitsListQueries: function(queries) {
        if (!_.isEmpty(queries) && (!this.visitsListQueries || !_.isEqual(this.visitsListQueries, queries))) {
            this.visitsListQueries = queries;
        }
    }
});
