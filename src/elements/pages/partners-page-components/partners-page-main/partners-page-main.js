'use strict';

Polymer({
    is: 'partners-page-main',
    behaviors: [
        TPMBehaviors.QueryParamsController,
        TPMBehaviors.StaticDataController,
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

    checkUser: function(user) {
        if (!this.userGroups) {
            this.userGroups = this.getData('userGroups');
        }
        return !!~this.userGroups.indexOf(user);
    },

    _routeConfig: function(view) {
        if (!this.route || !~this.route.prefix.indexOf('/partners')) { return; }
        if (view === 'list' && !this.checkUser('Third Party Monitor')) {
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

        if (!queries.ordered_by) { queriesUpdates.ordered_by = 'vendor_number.asc'; }


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
