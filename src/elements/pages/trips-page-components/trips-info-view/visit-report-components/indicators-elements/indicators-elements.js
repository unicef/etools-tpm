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
        }
    },

    _canBeRemoved: function(index) {
        if (!this.editMode) {
            return false;
        }
        return true;
    },

    _revertIndicator: function() {
        if (this.editMode) {
            var lastLocationAdded = this.dataItems[this.dataItems.length - 1];
            // if (lastLocationAdded
            //     && !this._notEmpty(lastLocationAdded.location)) {
            //     this.fire('toast', {text: 'Last staff member fields are empty!', showCloseBtn: true});
            // } else {
            this._addElement();
            // }
        }
    },
    _getItemNumber: function(index) {
        return index + 1;
    },
    _deleteIndicator: function(e) {
        if (this.dataItems.length === 1) {
            this.fire('toast', {text: 'You can\'t remove last indicator!'})
        } else {
            this._openDeleteConfirmation(e);
        }
    }
    // _addTypeOfSite: function(event) {
    //     let model = event.model;
    //     if (!model.location.type_of_sites) model.set('location.type_of_sites', []);
    //
    //     model.push('location.type_of_sites', {site: '', visits: []})
    // }
});