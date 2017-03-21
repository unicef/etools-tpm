'use strict';

Polymer({
    is: 'file-attachments-tab',
    properties: {
        fileTypes: {
            type: Array,
            value: [
                {id: 'tr_materials', name: 'Training materials'},
                {id: 'tors', name: 'ToRs'},
                {id: 'other', name: 'Other'}
            ]
        },
        files: {
            type: Array,
            value: [
                {file_name: 'Filename_document.doc', type: 'tr_materials'},
                {file_name: 'Filename_document.doc', type: 'other'}
            ]
        },
        readonly: {
            type: Boolean,
            value: false
        }
    },
    _hideEmptyState: function(length) { return length > 0;}
});