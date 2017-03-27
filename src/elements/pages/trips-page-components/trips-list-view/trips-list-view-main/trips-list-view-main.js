'use strict';

Polymer({
    is: 'trips-list-view-main',
    properties: {
        queryParams: {
            type: Object,
            notify: true
        },
        listHeadings: {
            type: Array,
            value: function () {
                return [{
                    'size': 20,
                    'label': 'Vendor #',
                    'name': 'vendor_number',
                    'ordered': false
                }, {
                    'size': 20,
                    'label': 'Implementing Partner',
                    'name': 'name',
                    'ordered': false
                }, {
                    'size': 20,
                    'label': 'Location',
                    'name': 'location',
                    'ordered': false
                }, {
                    'size': 20,
                    'label': 'UNICEF Focal Point',
                    'name': 'focal_point',
                    'ordered': false
                }, {
                    'size': 20,
                    'label': 'Status',
                    'name': 'status',
                    'ordered': false
                }];
            }
        }
    }
});