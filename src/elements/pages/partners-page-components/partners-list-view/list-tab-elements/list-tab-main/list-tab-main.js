'use strict';

Polymer({
    is: 'list-tab-main',
    behaviors: [MyBehaviors.QueryParamsController],
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
            computed: '_calcDataLength(data)'
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
        if (this.orderBy !== newParams.ordered_by) this.orderBy = newParams.ordered_by;

        if (newParams.page) {
            let page = +newParams.page;
            if (page < 2 || isNaN(page) || (!!this.lastParams && newParams.size !== this.lastParams.size)) {
                this.updateQueries({page: false});
            } else {
                let lastPage = this.datalength % this.queryParams.size ?
                    Math.floor(this.datalength / this.queryParams.size + 1) :
                this.datalength / this.queryParams.size;

                if (page >= lastPage) {
                    page = lastPage;
                }
                this.set('queryParams.page', `${page}`);
            }
        }

        if (!this.lastParams) { this.lastParams = _.clone(newParams); }
        else if (!_.isEqual(this.lastParams, newParams)) { this.lastParams = _.clone(newParams); }

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
    },
    _calcDataLength: function(data) { return data.length; }
});