'use strict';

Polymer({
    is: 'visit-activity-tab',

    properties: {
        columns: {
            type: Array,
            value: [{
                'size': 60,
                'label': 'Implementing Partner'
            }, {
                'size': 40,
                'label': 'Partnership'
            }]
        }
    }
});
