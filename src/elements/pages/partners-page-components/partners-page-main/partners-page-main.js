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
        }
    },
    observers: [
        '_routeConfig(routeData.view)'
    ],

    created: function() {
        if (this.checkPermission('viewPartnersList')) {
            let url = this.resolveUrl('../partners-list-view/partners-list-view-main.html');
            this.importHref(url, null, null, true);
        }
    },

    _routeConfig: function(view) {
        if (this.base !== 'partners') return;
        if (view === 'list' && this.checkPermission('viewPartnersList')) {
            let queries = this._configListParams();
            this._setPartnersListQueries(queries);
            this.view = 'list'
        } else if (!isNaN(+view)) {
            this.clearQueries();
            this.partnerId = +view;
        } else {
            this.fire('404');
        }
    },
    _configListParams: function() {
        let queriesUpdates = {},
            queries = this.parseQueries();

        if (!queries.size)  queriesUpdates.size = '10';
        if (!queries.ordered_by) queriesUpdates.ordered_by = 'vendor_number.asc';

        if (queries.page) {
            let page = +queries.page;
            if (page < 2 || isNaN(page) ||
                (!!this.lastParams && (queries.size !== this.lastParams.size || queries.ordered_by !== this.lastParams.ordered_by))) {
                queriesUpdates.page = false;
            }
        }

        if (!this.lastParams) { this.lastParams = _.clone(queries); }
        else if (!_.isEqual(this.lastParams, queries)) { this.lastParams = _.clone(queries); }


        this.updateQueries(queriesUpdates);
        return this.parseQueries();
    },
    _queryParamsChanged: function() {
        if (this.base !== 'partners' || !this.routeData) return;
        if (this.routeData.view === 'list') {
            let queries = this._configListParams();
            this._setPartnersListQueries(queries)
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