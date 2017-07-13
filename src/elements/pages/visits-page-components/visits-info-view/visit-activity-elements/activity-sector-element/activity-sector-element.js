'use strict';

Polymer({
    is: 'activity-sector-element',

    properties: {
        headings: {
            type: Array,
            value: [{
                'size': 100,
                'label': 'Sector Covered',
                'path': 'sector.name'
            }]
        },
        sectorsColumns: {
            type: Array,
            value: [{
                'size': 100,
                'label': 'PP/SSFA Output'
            }]
        },
        emptyObject: {
            type: Object,
            value: function() {
                return {};
            }
        }
    }
});
