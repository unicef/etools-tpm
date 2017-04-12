'use strict';

Polymer({
    is: 'file-attachments-tab',
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
        },
        title: {
            type: String,
            value: 'Attachments'
        },
        readonly: {
            type: Boolean
        },
        allowDownload: {
            type: Boolean
        },
        allowChange: {
            type: Boolean
        },
        allowDelete: {
            type: Boolean
        },
        fileCheckboxVisible: {
            type: Boolean,
            value: false
        },
        fileCheckboxTitle: {
            type: String
        },
        fileCheckboxLabel: {
            type: String
        },
    },
    _hideEmptyState: function(length) { return length > 0;}
});
