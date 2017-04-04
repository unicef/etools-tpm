'use strict';

Polymer({
    is: 'partner-details-tab',
    properties: {
        editMode: {
            type: Boolean,
            observer: 'updateStyles'
        }
    }
});