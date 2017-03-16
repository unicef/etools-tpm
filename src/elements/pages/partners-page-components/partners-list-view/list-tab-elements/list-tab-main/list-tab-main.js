'use strict';

Polymer({
    is: 'list-tab-main',
    properties: {
        headings: {
            type: Array,
            value: function () {
                return [{
                    'size': 2,
                    'label': 'Vendor #',
                    'name': 'vendor',
                    'ordered': false
                }, {
                    'size': 3,
                    'label': 'Vendor Name',
                    'name': 'name',
                    'ordered': false
                }, {
                    'size': 2,
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
            value: '1 - 2 of 2'
            // computed: '_computeResultsToShow(pages, datalength, pages.page)'
        },
        orderBy: {
            type: String,
            value: '',
            observer: '_orderChanged'
        },
        data: {
            type: Array,
            value: [{
                vendor_number: '1231231',
                name: 'Nfsdfsdf swkjnwe werkj',
                short_name: '1mm',
                status: 'Sync from vision'
            }, {
                vendor_number: '1231231',
                name: 'Nfsdfsdf swkjnwe werkj',
                short_name: '1mm',
                status: 'Sync from vision'
            }, {
                vendor_number: '1231231',
                name: 'Nfsdfsdf swkjnwe werkj',
                short_name: '1mm',
                status: 'Sync from vision'
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
        if (!newParams.ordered_by) {
            this.set('queryParams.ordered_by', 'vendor.asc');
            return;
        }

        if (this.orderBy !== newParams.ordered_by) this.orderBy = newParams.ordered_by;
    }
});