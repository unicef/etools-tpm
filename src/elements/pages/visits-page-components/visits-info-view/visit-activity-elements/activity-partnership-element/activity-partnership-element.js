'use strict';

Polymer({
    is: 'activity-partnership-element',

    properties: {
        headings: {
            type: Array,
            value: [{
                'size': 60,
                'label': 'Implementing Partner',
                'path': 'partnership.partner'
            }, {
                'size': 40,
                'label': 'Partnership',
                'path': 'partnership.number'
            }]
        },
        sectorsColumns: {
            type: Array,
            value: [{
                'size': 100,
                'label': 'Sector Covered'
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
