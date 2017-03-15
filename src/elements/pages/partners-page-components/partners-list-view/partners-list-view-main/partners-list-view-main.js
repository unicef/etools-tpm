'use strict';

Polymer({
    is: 'partners-list-view-main',
    properties: {
        newVendorOpened: Boolean
    },
    listeners: {
        'addNewVendor': 'openNewVendorDialog'
    },
    openNewVendorDialog: function() {
        this.newVendorOpened = true;
    }
});