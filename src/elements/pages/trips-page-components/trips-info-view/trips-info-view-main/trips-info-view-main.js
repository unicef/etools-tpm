'use strict';

Polymer({
    is: 'trips-info-view-main',
    properties: {
        fileTypes: {
            type: Array,
            value: [
                {id: '1', name: 'Training materials'},
                {id: '2', name: 'ToRs'},
                {id: '3', name: 'Other'}
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
