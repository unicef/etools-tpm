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
                {file_name: 'Filename_document.doc', type: '1'},
                {file_name: 'Filename_document.doc', type: '3'}
            ]
        },
        title: {
            type: String,
            value: 'Attachments'
        }
    },
    _hideEmptyState: function(length) { return length > 0;}
});