'use strict';

Polymer({
    is: 'visit-report-indicators-tabs',
    properties: {
        indicators: {
            type: Array,
            notify: true
        },
        editMode: {
            type: Boolean,
            value: true
        }
    }
});
