'use strict';

Polymer({
    is: 'partner-details-tab',
    properties: {
        editMode: {
            type: Boolean,
            observer: 'updateStyles'
        }
    },
    _getTitleValue: function(value) { return value || ''; },
    validate: function() { return true; }
});
