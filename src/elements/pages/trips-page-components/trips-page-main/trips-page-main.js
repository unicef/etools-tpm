'use strict';

Polymer({
    is: 'trips-page-main',
    behaviors: [TPMBehaviors.QueryParamsController],
    properties: {
        queryParams: {
            type: Object,
            notify: true,
            observer: '_queryParamsChanged'
        }
    },
    observers: [
        '_routeConfig(routeData.view)'
    ],

    _routeConfig: function(view) {
        if (this.route && !~this.route.prefix.indexOf('/trips')) { return; }
        if (view === 'list') {
            let queries = this._configListParams();
            this._setTripsListQueries(queries);
            this.view = 'list';
        } else if (!isNaN(+view)) {
            this.clearQueries();
            this.visitId = +view;
        } else {
            this.fire('404');
        }
    },
    _configListParams: function() {
        let queriesUpdates = {},
            queries = this.parseQueries();

        if (!queries.size) { queriesUpdates.size = '10'; }
        if (!queries.ordered_by) { queriesUpdates.ordered_by = 'vendor_number.asc'; }

        if (queries.page) {
            let page = +queries.page;
            if (page < 2 || isNaN(page) ||
                (!!this.lastParams && (queries.size !== this.lastParams.size || queries.ordered_by !== this.lastParams.ordered_by))) {
                queriesUpdates.page = false;
            }
        }

        if (!this.lastParams) { this.lastParams = _.clone(queries); } else if (!_.isEqual(this.lastParams, queries)) { this.lastParams = _.clone(queries); }

        this.updateQueries(queriesUpdates);
        return this.parseQueries();
    },
    _queryParamsChanged: function() {
        if (!~this.route.prefix.indexOf('/trips') || !this.routeData) { return; }
        if (this.routeData.view === 'list') {
            let queries = this._configListParams();
            this._setTripsListQueries(queries);
        } else if (!isNaN(+this.routeData.view)) {
            this.clearQueries();
        }
    },
    _setTripsListQueries: function(queries) {
        if (!_.isEmpty(queries) && (!this.lastListDataRequest || !_.isEqual(this.lastListDataRequest, queries))) {
            this.lastListDataRequest = queries;
        }
    }
});
