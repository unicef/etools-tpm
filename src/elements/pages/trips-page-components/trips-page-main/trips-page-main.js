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
            // setTimeout(() => {
            //     this.listData = [{
            //         "id": 193,
            //         "vendor_number": "2300015180",
            //         "deleted_flag": false,
            //         "blocked": false,
            //         "name": "MINISTRY OF SOCIAL WELFARE & CULTURE - EL FASHERNORTH DARFUR",
            //         "short_name": "",
            //         "partner_type": "",
            //         "cso_type": null,
            //         "rating": null,
            //         "shared_partner": "No",
            //         "shared_with": null,
            //         "email": 'CCCWESTPOKOT@GMAIL.COM',
            //         "phone_number": '254-722-617-626',
            //         "total_ct_cp": null,
            //         "total_ct_cy": null,
            //         "hidden": true,
            //         "vision_synced": true
            //     }, {
            //         "vision_synced": true,"id":60,"vendor_number":"1900705039","deleted_flag":true,"blocked":false,"name":"ACTION AGAINST HUNGER","short_name":"","partner_type":"Civil Society Organization","cso_type":"International NGO","rating":"Low","shared_partner":"No","shared_with":null,"email":null,"phone_number":"020 4348581","total_ct_cp":"0.00","total_ct_cy":"0.00","hidden":true
            //     },{
            //         "vision_synced": true,"id":60,"vendor_number":"1900705039","deleted_flag":true,"blocked":false,"name":"ACTION AGAINST HUNGER","short_name":"","partner_type":"Civil Society Organization","cso_type":"International NGO","rating":"Low","shared_partner":"No","shared_with":null,"email":null,"phone_number":"020 4348581","total_ct_cp":"0.00","total_ct_cy":"0.00","hidden":true
            //     },{
            //         "vision_synced": true,"id":60,"vendor_number":"1900705039","deleted_flag":true,"blocked":false,"name":"ACTION AGAINST HUNGER","short_name":"","partner_type":"Civil Society Organization","cso_type":"International NGO","rating":"Low","shared_partner":"No","shared_with":null,"email":null,"phone_number":"020 4348581","total_ct_cp":"0.00","total_ct_cy":"0.00","hidden":true
            //     },{
            //         "vision_synced": true,"id":60,"vendor_number":"1900705039","deleted_flag":true,"blocked":false,"name":"ACTION AGAINST HUNGER","short_name":"","partner_type":"Civil Society Organization","cso_type":"International NGO","rating":"Low","shared_partner":"No","shared_with":null,"email":null,"phone_number":"020 4348581","total_ct_cp":"0.00","total_ct_cy":"0.00","hidden":true
            //     },{
            //         "vision_synced": true,"id":60,"vendor_number":"1900705039","deleted_flag":true,"blocked":false,"name":"ACTION AGAINST HUNGER","short_name":"","partner_type":"Civil Society Organization","cso_type":"International NGO","rating":"Low","shared_partner":"No","shared_with":null,"email":null,"phone_number":"020 4348581","total_ct_cp":"0.00","total_ct_cy":"0.00","hidden":true
            //     },{
            //         "vision_synced": true,"id":60,"vendor_number":"1900705039","deleted_flag":true,"blocked":false,"name":"ACTION AGAINST HUNGER","short_name":"","partner_type":"Civil Society Organization","cso_type":"International NGO","rating":"Low","shared_partner":"No","shared_with":null,"email":null,"phone_number":"020 4348581","total_ct_cp":"0.00","total_ct_cy":"0.00","hidden":true
            //     },{
            //         "vision_synced": true,"id":60,"vendor_number":"1900705039","deleted_flag":true,"blocked":false,"name":"ACTION AGAINST HUNGER","short_name":"","partner_type":"Civil Society Organization","cso_type":"International NGO","rating":"Low","shared_partner":"No","shared_with":null,"email":null,"phone_number":"020 4348581","total_ct_cp":"0.00","total_ct_cy":"0.00","hidden":true
            //     },{
            //         "vision_synced": true,"id":60,"vendor_number":"1900705039","deleted_flag":true,"blocked":false,"name":"ACTION AGAINST HUNGER","short_name":"","partner_type":"Civil Society Organization","cso_type":"International NGO","rating":"Low","shared_partner":"No","shared_with":null,"email":null,"phone_number":"020 4348581","total_ct_cp":"0.00","total_ct_cy":"0.00","hidden":true
            //     },{
            //         "vision_synced": true,"id":60,"vendor_number":"1900705039","deleted_flag":true,"blocked":false,"name":"ACTION AGAINST HUNGER","short_name":"","partner_type":"Civil Society Organization","cso_type":"International NGO","rating":"Low","shared_partner":"No","shared_with":null,"email":null,"phone_number":"020 4348581","total_ct_cp":"0.00","total_ct_cy":"0.00","hidden":true
            //     },{
            //         "vision_synced": true,"id":60,"vendor_number":"1900705039","deleted_flag":true,"blocked":false,"name":"ACTION AGAINST HUNGER","short_name":"","partner_type":"Civil Society Organization","cso_type":"International NGO","rating":"Low","shared_partner":"No","shared_with":null,"email":null,"phone_number":"020 4348581","total_ct_cp":"0.00","total_ct_cy":"0.00","hidden":true
            //     },{
            //         "vision_synced": true,"id":60,"vendor_number":"1900705039","deleted_flag":true,"blocked":false,"name":"ACTION AGAINST HUNGER","short_name":"","partner_type":"Civil Society Organization","cso_type":"International NGO","rating":"Low","shared_partner":"No","shared_with":null,"email":null,"phone_number":"020 4348581","total_ct_cp":"0.00","total_ct_cy":"0.00","hidden":true
            //     }]
            // }, 500)
            this.lastListDataRequest = queries;
        }
    }
});