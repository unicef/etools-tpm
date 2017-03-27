'use strict';

(function() {
    let filters = [
        {
            name: 'Vendor',
            filterName: 'f_vendor',
            selection: []
        },
        {
            name: 'Implementing Partner',
            filterName: 'f_impl_partner',
            selection: []
        },
        {
            name: 'Location',
            filterName: 'f_location',
            selection: []
        },
        {
            name: 'UNICEF Focal Point',
            filterName: 'f_focal_point',
            selection: []
        },
        {
            name: 'Status',
            filterName: 'f_status',
            selection: []
        }
    ];

    Polymer({
        is: 'trips-list-view-main',
        properties: {
            queryParams: {
                type: Object,
                notify: true
            },
            filters: {
                type: Array,
                value: filters
            },
            listHeadings: {
                type: Array,
                value: function () {
                    return [{
                        'size': 20,
                        'label': 'Vendor #',
                        'name': 'vendor_number',
                        'link': '/trips/*data_id*/detais',
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
})();

