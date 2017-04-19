'use strict';

Polymer({
    is: 'partners-page-main',
    behaviors: [
        TPMBehaviors.QueryParamsController,
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
        },
        initiation: {
            type: Number,
            value: 0
        }
    },
    observers: [
        '_routeConfig(routeData.view)'
    ],

    _routeConfig: function(view) {
        if (!this.route || !~this.route.prefix.indexOf('/partners')) { return; }
        if (view === 'list' && this.checkPermission('viewPartnersList')) {
            let queries = this._configListParams(this.initiation++);
            this._setPartnersListQueries(queries);
            this.view = 'list';
        } else if (!isNaN(+view)) {
            this.clearQueries();
            this.partnerId = +view;
        } else {
            this.fire('404');
        }
    },
    _configListParams: function(noNotify) {
        let queriesUpdates = {},
            queries = this.parseQueries();

        if (!this.withoutPagination && !queries.size) { queriesUpdates.size = '10'; }
        if (!queries.ordered_by) { queriesUpdates.ordered_by = 'vendor_number.asc'; }

        if (!this.withoutPagination && queries.page) {
            let page = +queries.page;
            if (page < 2 || isNaN(page) ||
                (!!this.lastParams && (queries.size !== this.lastParams.size || queries.ordered_by !== this.lastParams.ordered_by))) {
                queriesUpdates.page = false;
            }
        }

        if (!this.lastParams) {
            this.lastParams = _.clone(queries);
        } else if (!_.isEqual(this.lastParams, queries)) {
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
            this.clearQueries();
        }
    },
    _setPartnersListQueries: function(queries) {
        if (!_.isEmpty(queries) && (!this.partnersListQueries || !_.isEqual(this.partnersListQueries, queries))) {
            this.partnersListQueries = queries;
        }
    }
});
