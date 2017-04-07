'use strict';

Polymer({
    is: 'visit-report-questions-tab',

    behaviors: [
        TPMBehaviors.RepeatableDataSetsBehavior
    ],
    properties: {
        dataItems: {
            type: Array,
            notify: true
        },
        categories: {
            type: Array,
            value: [{'value': 1,'label': 'Quality'}, {'value': 2,'label': 'Access'}, {'value': 3,'label': 'Other'}]
        }
    },

    ready: function() {
        this.dataSetModel = {
            category: {},
            question: ''
        };
    },

    _canBeRemoved: function() {
        return this.editMode;
    },

    _notEmpty: function(value) {
        return typeof value !== 'undefined' && value !== null && value !== '';
    },
    _addNewQuestion: function() {
        if (this.editMode) { this._addElement(); }
    }
});
