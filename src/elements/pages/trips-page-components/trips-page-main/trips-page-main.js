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
        if (this.base !== 'trips') return;
        if (view === 'list') {
            let queries = this._configListParams();
            this._loadTripsListData(queries);
            this.view = 'list'
        } else if (!isNaN(+view)) {
            this.view = 'visit';
            this.clearQueries();
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
            if (page < 2 || isNaN(page) || (!!this.lastParams && queries.size !== this.lastParams.size)) {
                queriesUpdates.page = false;
            } else {
                let lastPage = this.datalength % this.queryParams.size ?
                    Math.floor(this.datalength / this.queryParams.size + 1) :
                this.datalength / this.queryParams.size;

                if (page >= lastPage) {
                    page = lastPage;
                }
                queriesUpdates.page = `${page}`;
            }
        }

        if (!this.lastParams) { this.lastParams = _.clone(queries); }
        else if (!_.isEqual(this.lastParams, queries)) { this.lastParams = _.clone(queries); }


        this.updateQueries(queriesUpdates);
        return this.parseQueries();
    },
    _queryParamsChanged: function() {
        if (this.base !== 'trips' || !this.routeData) return;
        if (this.routeData.view === 'list') {
            let queries = this._configListParams();
            this._loadTripsListData(queries)
        } else if (!isNaN(+this.routeData.view)) {
            this.clearQueries();
        }
    },
    _loadTripsListData: function(queries) {
        if (!_.isEmpty(queries) && (!this.lastListDataRequest || !_.isEqual(this.lastListDataRequest, queries))) {
            console.log(queries);
            setTimeout(() => {
                this.listData = [{
                    "id": 192,
                    "vendor_number": "2300015180",
                    "name": "MINISTRY OF SOCIAL WELFARE & CULTURE - EL FASHERNORTH DARFUR",
                    "short_name": "",
                    "vision_synced": true,
                    "location": 'Ghazze(#125646)',
                    "focal_point": 'John Smith'
                }]
            }, 500);
            this.lastListDataRequest = queries;
        }
    }
});