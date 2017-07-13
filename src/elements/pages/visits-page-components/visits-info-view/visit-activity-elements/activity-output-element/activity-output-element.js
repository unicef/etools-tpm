'use strict';

Polymer({
    is: 'activity-output-element',

    properties: {
        headings: {
            type: Array,
            value: [{
                'size': 100,
                'path': 'result.name'
            }]
        },
        locationsColumns: {
            type: Array,
            value: [{
                'size': 25,
                'label': 'Location',
                'path': 'location.name'
            },{
                'size': 20,
                'label': 'Start Date',
                'path': 'start_date'
            },{
                'size': 20,
                'label': 'End Date',
                'path': 'end_date'
            },{
                'size': 35,
                'label': 'Type of Site',
                'path': 'type_of_site'
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
