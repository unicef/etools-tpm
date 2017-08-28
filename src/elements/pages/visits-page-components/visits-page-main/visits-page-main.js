'use strict';

Polymer({
    is: 'visits-page-main',

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
        '_routeConfig(routeData.view)',
        '_visitLoaded(visitDetails)'
    ],

    _routeConfig: function(view) {
        if (!this.route || !~this.route.prefix.indexOf('/visits')) { return; }
        if (view === 'list') {
            let queries = this._configListParams(this.initiation++);
            this._setVisitsListQueries(queries);
            this.view = 'list';
        } else if (!isNaN(+view)) {
            this.clearQueries();
            this.visitId = +view;
        } else if (view === '' || _.isUndefined(view)) {
            this.set('route.path', '/list');
        } else {
            this.clearQueries();
            this.fire('404');
        }
    },

    _configListParams: function(noNotify) {
        let queriesUpdates = {},
            queries = this.parseQueries();

        if (!queries.page_size) { queriesUpdates.page_size = '10'; }
        if (!queries.ordering) { queriesUpdates.ordering = 'reference_number'; }
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
        if (!~this.route.prefix.indexOf('/visits') || !this.routeData) { return; }
        if (this.routeData.view === 'list') {
            let queries = this._configListParams();
            this._setVisitsListQueries(queries);
        } else if (!isNaN(+this.routeData.view)) {
            this.clearQueries();
        }
    },

    _setVisitsListQueries: function(queries) {
        if (!_.isEmpty(queries) && (!this.visitsListQueries || !_.isEqual(this.visitsListQueries, queries))) {
            this.visitsListQueries = queries;
        }
    },

    _visitLoaded: function(visitDetails) {
        if (!visitDetails) { return; }
        this._setOriginalData(_.cloneDeep(visitDetails));
    }

});
