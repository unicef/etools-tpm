'use strict';

Polymer({
    is: 'list-element',
    _toggleRowDetails: function() {
        this.$.details.toggle();
    },
    _isLink: function(link) {
        console.log(link)
        return !!link;
    },
    _getValue: function(fieldName) {
        let value = fieldName === 'status' ? this._getStatus(this.data['vision_synced']) : this.data[fieldName] || '--';
        return value;
    },
    _getStatus: function(synced) {
        if (synced) return 'Synced from VISION';
    },
    _getDisplayValue: function(value) {
        return value || '--'
    }
});