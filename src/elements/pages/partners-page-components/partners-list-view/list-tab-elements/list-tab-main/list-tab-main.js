'use strict';

Polymer({
    is: 'list-tab-main',
    properties: {
        showingResults: {
            type: String,
            value: '0 - 2 of 2'
            // computed: '_computeResultsToShow(pages, datalength, pages.page)'
        },
        headings: {
            type: Array,
            value: function () {
                return [
                    {
                        'size': 25,
                        'label': 'Vendor #'
                    },
                    {
                        'size': 23,
                        'label': 'Vendor Name'
                    },
                    {
                        'size': 25,
                        'label': 'Status'
                    }
                ]
            }
        },

    }
});