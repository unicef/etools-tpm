'use strict';

Polymer({
    is: 'visits-info-view-main',
    properties: {
        fileTypes: {
            type: Array,
            value: [
                {value: '1', display_name: 'Training materials'},
                {value: '2', display_name: 'ToRs'},
                {value: '3', display_name: 'Other'}
            ]
        },
        files: {
            type: Array,
            value: function() {
                return [];
            }
        }
    },
});
