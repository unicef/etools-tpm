'use strict';

Polymer({
    is: 'trips-page-main',
    behaviors: [TPMBehaviors.QueryParamsController],
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
        '_routeConfig(route)'
    ],

    _routeConfig: function(route) {
        if (this.route && !~this.route.prefix.indexOf('/trips')) { return; }
        let view = this.routeData ? this.routeData.view : route.path.split('/')[1];
        if (view === 'list') {
            let queries = this._configListParams();
            this._setTripsListQueries(queries);
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

        if (!queries.ordered_by) { queriesUpdates.ordered_by = 'vendor_number.asc'; }

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
        if (!~this.route.prefix.indexOf('/trips') || !this.routeData) { return; }
        if (this.routeData.view === 'list') {
            let queries = this._configListParams();
            this._setTripsListQueries(queries);
        } else if (!isNaN(+this.routeData.view)) {
            this.debounce('clearSearchQueries', () => {
                this.clearQueries();
            }, 100);
        }
    },
    _setTripsListQueries: function(queries) {
        if (!_.isEmpty(queries) && (!this.lastListDataRequest || !_.isEqual(this.lastListDataRequest, queries))) {
            this.lastListDataRequest = queries;
        }
    }
});
