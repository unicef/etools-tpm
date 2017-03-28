'use strict';

Polymer({
    is: 'type-of-site-item',

    behaviors: [
        TPMBehaviors.RepeatableDataSetsBehavior
    ],
    properties: { },

    ready: function() {
        this.dataSetModel = {
            id: null,
            visit: null,
            site: null,
        };
    },

    _canBeRemoved: function(index) {
        if (!this.editMode) {
            return false;
        }
        if (this.dataItems[index] &&
            typeof this.dataItems[index].id !== 'undefined' && this.dataItems[index].id !== null) {
            return false;
        }
        return true;
    },

    _notEmpty: function(value) {
        return typeof value !== 'undefined' && value !== null && value !== '';
    },

    _addTypeOfSite: function() {
        if (this.editMode) {
            var lastLocationAdded = this.dataItems[this.dataItems.length - 1];
            if (lastLocationAdded
                && !this._notEmpty(lastLocationAdded.site)) {
                this.fire('toast', {text: 'Last Type of Site field is empty!', showCloseBtn: true});
            } else {
            this._addElement();
            }
        }
    },
    _getItemNumber: function(index) {
        return index + 1;
    }
});