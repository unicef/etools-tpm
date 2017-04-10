'use strict';

Polymer({
    is: 'indicators-elements',

    behaviors: [
        TPMBehaviors.RepeatableDataSetsBehavior
    ],
    properties: {
        dataItems: {
            type: Array,
            notify: true
        },
        deletedIndicators: {
            type: Array,
            value: function() {
                return [];
            }
        }
    },

    ready: function() {window.test = this;},
    _canBeRemoved: function() {
        return this.editMode;
    },

    _revertIndicator: function(e) {
        let element = e.model.item,
            index = this.deletedIndicators.indexOf(element);

        if (index < 0) { return; }

        this.splice('deletedIndicators', index, 1);
        this.push('dataItems', element);
    },
    _deleteElement: function() {
        var index = this.elToDeleteIndex;
        if (!this.editMode) { return; }

        if (index !== null && typeof index !== 'undefined' && index !== -1) {
            let element = this.splice('dataItems', index, 1);
            this.push('deletedIndicators', element[0]);
            this.fire('delete-confirm', {index: this.elToDeleteIndex});
        }
    },
    _getItemNumber: function(index) {
        return index + 1;
    },
    _deleteIndicator: function(e) {
        if (this.dataItems.length === 1) {
            this.fire('toast', {text: 'You can\'t remove last indicator!'});
        } else {
            this._openDeleteConfirmation(e);
        }
    },
    _hideUndo: function(length) {
        return !length;
    },
    _revertAll: function() {
        let elements = this.splice('deletedIndicators', 0, this.deletedIndicators.length);
        this.push('dataItems', ...elements);
    }
});
