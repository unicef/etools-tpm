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

    ready: function() {
        var revertConfirmationContent = document.createElement('p');
        this.revertDialogContent = revertConfirmationContent;
        this.revertDialog = this.createDialog('Revert confirmation', 'md', 'Yes',
            'No', this._revertIndicator.bind(this), revertConfirmationContent);
    },

    _canBeRemoved: function() {
        return this.editMode;
    },

    revertIndicator: function(e) {
        this.elementsToRevert = this.deletedIndicators.indexOf(e.model.item);
        this.revertDialogContent.innerHTML = 'Do you want to revert this indicator?';
        this.revertDialog.opened = true;
    },

    revertAll: function() {
        this.elementsToRevert = 'all';
        this.revertDialogContent.innerHTML = 'Do you want to revert <span style="text-decoration: underline;">all</span> indicator?';
        this.revertDialog.opened = true;
    },

    _revertIndicator: function(e) {
        if (!this.elementsToRevert && this.elementsToRevert !== 0) { return; }

        if (e.detail.confirmed === true && this.elementsToRevert === 'all') {
            let elements = this.splice('deletedIndicators', 0, this.deletedIndicators.length);
            this.push('dataItems', ...elements);
        } else if (e.detail.confirmed === true) {
            let element = this.splice('deletedIndicators', this.deletedIndicators, 1);
            this.push('dataItems', element[0]);
        }

        this.elementsToRevert = null;
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
    }

});
