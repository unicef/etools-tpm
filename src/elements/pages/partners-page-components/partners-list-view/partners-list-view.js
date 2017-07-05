'use strict';

(function() {
    Polymer({
        is: 'partners-list-view',

        behaviors: [
            TPMBehaviors.PermissionController,
        ],

        properties: {
            newVendorOpened: {
                type: Boolean,
                value: false
            },
            queryParams: {
                type: Object,
                notify: true
            },
            listHeadings: {
                type: Array,
                value: [{
                    'size': 25,
                    'label': 'Vendor #',
                    'name': 'vendor_number',
                    'link': 'partners/*data_id*/details',
                    'ordered': false
                }, {
                    'size': 45,
                    'label': 'Vendor Name',
                    'name': 'name',
                    'ordered': false
                }, {
                    'size': 30,
                    'label': 'Country',
                    'name': 'country',
                    'ordered': false
                }]
            },
            listDetails: {
                type: Array,
                value: function() {
                    return [{
                        'size': 20,
                        'label': 'Email',
                        'name': 'email'
                    }, {
                        'size': 20,
                        'label': 'Phone #',
                        'name': 'phone_number'
                    }];
                }
            },
            partnersList: {
                type: Array,
                value: []
            },
        },

        listeners: {
            'add-new-tap': 'openNewVendorDialog'
        },

        openNewVendorDialog: function() {
            this.newVendorOpened = true;
        },

        _showAddButton: function() {
            return this.actionAllowed('new_partner', 'save');
        },
    });
})();
