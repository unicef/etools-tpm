'use strict';

Polymer({
    is: 'partners-list-view-main',
    properties: {
        newVendorOpened: Boolean,
        queryParams: {
            type: Object,
            notify: true
        }
    },
    listeners: {
        'addNewVendor': 'openNewVendorDialog'
    },
    openNewVendorDialog: function() {
        this.newVendorOpened = true;
    }
});