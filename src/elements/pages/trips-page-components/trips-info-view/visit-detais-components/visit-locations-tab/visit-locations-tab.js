'use strict';

Polymer({
    is: 'visit-locations-tab',

    behaviors: [
        TPMBehaviors.RepeatableDataSetsBehavior
    ],
    properties: {
        dataItems: {
            type: Array,
            value: [{
                id: null,
                location: null,
                sectors: null,
                type_of_sites: [{}]
            }],
            notify: true
        }
    },

    ready: function() {
        this.dataSetModel = {
            id: null,
            location: null,
            sectors: null,
            type_of_sites: []
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

    _addNewLocation: function() {
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
    _addTypeOfSite: function(event) {
        let model = event.model;
        if (!model.location.type_of_sites) model.set('location.type_of_sites', []);

        model.push('location.type_of_sites', {site: '', visits: []})
    }
});