'use strict';

Polymer({
    is: 'visit-status',

    behaviors: [
        TPMBehaviors.PermissionController,
        TPMBehaviors.StaticDataController
    ],

    properties: {},

    ready: function() {
        this.statuses = this.getData('statuses');
    },

    _getStatusClass: function(currentStatus, status, statuses) {
        if (!currentStatus || !status) { return; }

        if (status === 'tpm_rejected') {
            return 'rejected';
        } else if (status === 'cancelled') {
            return 'cancelled';
        } else if (currentStatus === status) {
            return 'active';
        } else if (this._getStatusIndex(currentStatus, statuses) > this._getStatusIndex(status, statuses)) {
            return 'completed';
        } else {
            return 'pending';
        }
    },

    _getStatusIndex: function(status, statuses) {
        if (!status || !statuses) { return; }
        if (!this.statusesArray) { this.statusesArray = statuses.map((status) => { return status.value; }); }

        let currentIndex = this.statusesArray.indexOf(status);
        if (currentIndex > this.statusesArray.indexOf('tpm_accepted') ||
            currentIndex > this.statusesArray.indexOf('tpm_rejected')) {
            currentIndex -= 1;
        }

        return currentIndex >= 0 ? currentIndex : -1;
    },

    setIndex: function(status, statuses) {
        return this._getStatusIndex(status, statuses) + 1;
    },

    hideStatus: function(currentStatus, status) {
        return (status === 'tpm_accepted' && currentStatus === 'tpm_rejected') ||
            (status === 'tpm_rejected' && currentStatus !== 'tpm_rejected') ||
            (status === 'cancelled' && currentStatus !== 'cancelled') ||
            (status === 'tpm_rejected' && !currentStatus);
    },

    hideDivider: function(status, statuses) {
        let lastStatus = statuses[statuses.length - 1];
        return !!(lastStatus && lastStatus.value === status);
    }

});
