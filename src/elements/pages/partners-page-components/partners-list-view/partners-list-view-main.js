'use strict';

(function() {
    let filters = [
        {
            name: 'Status',
            filterName: 'f_status',
            selection: [
                {
                    label: 'Planned',
                    value: 0,
                    apiValue: 'planned'
                },
                {
                    label: 'Submitted',
                    value: 1,
                    apiValue: 'submitted'
                },
                {
                    label: 'Rejected',
                    value: 2,
                    apiValue: 'rejected'
                },
                {
                    label: 'Approved',
                    value: 3,
                    apiValue: 'approved'
                }
            ]
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
        }
    ];

    Polymer({
        is: 'partners-list-view-main',
        behaviors: [TPMBehaviors.PermissionController],
        properties: {
            newVendorOpened: Boolean,
            queryParams: {
                type: Object,
                notify: true
            },
            listHeadings: {
                type: Array,
                value: function () {
                    return [{
                        'size': 25,
                        'label': 'Vendor #',
                        'name': 'vendor_number',
                        'link': '/partners/*data_id*/details',
                        'ordered': false
                    }, {
                        'size': 50,
                        'label': 'Vendor Name',
                        'name': 'name',
                        'ordered': false
                    }, {
                        'size': 25,
                        'label': 'Country',
                        'name': 'country',
                        'ordered': false
                    }];
                }
            },
            filters: {
                type: Array,
                value: filters
            },
            partnersList: {
                type: Array,
                value: []
            }
        },
        listeners: {
            'addNewVendor': 'openNewVendorDialog'
        },
        openNewVendorDialog: function() { this.newVendorOpened = true; },
        _showAddButton: function() { return this.checkPermission('addNewPartner') }
    });
})();

