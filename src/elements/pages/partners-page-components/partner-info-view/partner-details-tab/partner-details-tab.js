'use strict';

Polymer({
    is: 'partner-details-tab',
    behaviors: [
        TPMBehaviors.PermissionController,
        TPMBehaviors.CommonMethodsBehavior
    ],

    properties: {
        editMode: {
            type: Boolean,
            observer: 'updateStyles'
        }
    },

    _setStatus: function(status) {
        if (!status) { return ''; }
        return status[0].toUpperCase() + status.slice(1);
    },

    _getTitleValue: function(value) { return value || ''; },

    validate: function() { return true; }
});
