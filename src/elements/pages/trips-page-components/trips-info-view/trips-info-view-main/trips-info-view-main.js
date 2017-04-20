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
            value: [
                {file_name: 'etools_logo_icon.png', type: '1', attachment_file: 'http://localhost:5000/images/etools_logo_icon.png'},
                {file_name: 'etools_logo_icon.png', type: '3', attachment_file: 'http://localhost:5000/images/etools_logo_icon.png', selected: true}
            ]
        }
    },
});
