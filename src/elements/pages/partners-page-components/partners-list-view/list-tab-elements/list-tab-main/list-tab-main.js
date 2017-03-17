'use strict';

Polymer({
    is: 'list-tab-main',
    properties: {
        headings: {
            type: Array,
            value: function () {
                return [{
                    'size': 25,
                    'label': 'Vendor #',
                    'name': 'vendor_number',
                    'ordered': false
                }, {
                    'size': 50,
                    'label': 'Vendor Name',
                    'name': 'name',
                    'ordered': false
                }, {
                    'size': 25,
                    'label': 'Status',
                    'name': 'status',
                    'ordered': false
                }];
            }
        },
        queryParams: {
            type: Object,
            notify: true,
            observer: '_paramsChanged'
        },
        showingResults: {
            type: String,
            computed: '_computeResultsToShow(datalength, queryParams.size)'
        },
        orderBy: {
            type: String,
            value: '',
            observer: '_orderChanged'
        },
        datalength: {
            type: Number,
            value: 121
        },
        data: {
            type: Array,
            value: [{
                "id": 193,
                "vendor_number": "2300015180",
                "deleted_flag": false,
                "blocked": false,
                "name": "MINISTRY OF SOCIAL WELFARE & CULTURE - EL FASHERNORTH DARFUR",
                "short_name": "",
                "partner_type": "",
                "cso_type": null,
                "rating": null,
                "shared_partner": "No",
                "shared_with": null,
                "email": 'CCCWESTPOKOT@GMAIL.COM',
                "phone_number": '254-722-617-626',
                "total_ct_cp": null,
                "total_ct_cy": null,
                "hidden": true,
                "vision_synced": true
            }, {
                "vision_synced": true,"id":60,"vendor_number":"1900705039","deleted_flag":true,"blocked":false,"name":"ACTION AGAINST HUNGER","short_name":"","partner_type":"Civil Society Organization","cso_type":"International NGO","rating":"Low","shared_partner":"No","shared_with":null,"email":null,"phone_number":"020 4348581","total_ct_cp":"0.00","total_ct_cy":"0.00","hidden":true
            }]
        }

    },
    _orderChanged: function (newOrder) {
        if (!newOrder) return;

        let [name, direction] = newOrder.split('.');

        this.headings.forEach((heading, index) => {
            if (heading.name === name) {
                this.set(`headings.${index}.ordered`, direction);
            } else {
                this.set(`headings.${index}.ordered`, false);
            }
        });

        if (this.queryParams.ordered_by !== this.orderBy) this.set('queryParams.ordered_by', this.orderBy);
    },
    _paramsChanged: function (newParams) {
        if (!newParams.size)  this.set('queryParams.size', '10');
        if (!newParams.ordered_by) this.set('queryParams.ordered_by', 'vendor_number.asc');

        if (this.orderBy !== newParams.ordered_by) this.orderBy = newParams.ordered_by;

        if (newParams.page) {
            let page = +newParams.page;
            if (page < 2 || isNaN(page) || (!!this.lastParams && newParams.size !== this.lastParams.size)) {
                this.set('queryParams.page', '1');
                this.pageMarker = 'first';
            } else {
                let lastPage = this.datalength % this.queryParams.size ?
                    Math.floor(this.datalength / this.queryParams.size + 1) :
                    this.datalength / this.queryParams.size;
                this.pageMarker = '';

                if (page >= lastPage) {
                    page = lastPage;
                    this.pageMarker = 'last';
                }
                this.set('queryParams.page', `${page}`);
            }
            this.currentPage = page;
        }
        if (+this.datalength <= this.queryParams.size) this.pageMarker = 'single';
        if (!this.pageMarker && this.pageMarker !== '') this.pageMarker = 'first';

        if (!this.lastParams) {
            this.lastParams = _.clone(newParams);
            console.log(newParams);
        } else if (!_.isEqual(this.lastParams, newParams)) {
            console.log(newParams);
            this.lastParams = _.clone(newParams);
        }

    },
    _getPartnerStatus: function(synced) {
        if (synced) return 'Synced from VISION';
    },
    _getDisplayValue: function(value) {
        return value || '-'
    },
    _computeResultsToShow: function(lengthAmount, size) {
        let page = (this.queryParams.page || 1) - 1;
        size = +(size || 10);
        let last = size*page+size;
        if (last > lengthAmount) last = lengthAmount;

        return `${size*page+1} - ${last} of ${lengthAmount}`
    }
});