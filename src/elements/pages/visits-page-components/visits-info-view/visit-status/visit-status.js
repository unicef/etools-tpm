'use strict';

Polymer({
    is: 'visit-status',

    behaviors: [
        TPMBehaviors.PermissionController,
        TPMBehaviors.StaticDataController
    ],

    properties: {
        dateProperties: {
            type: Object,
            value: function() {
                return {};
            }
        }
    },

    observers: ['_setCancelledPosition(visit.status)'],

    ready: function() {
        this.statuses = this.getData('statuses') || [];
        _.each(this.statuses, (status) => {
            if (status.value === 'draft') {
                this.set(`dateProperties.draft`, 'date_created');
            } else {
                this.set(`dateProperties.${status.value}`, `date_of_${status.value}`);
            }
        })
    },

    _getStatusClass: function(visit, status, statuses) {
        if (!visit || !visit.status || !status) { return; }
        let currentStatus = visit.status,
            statusDateField = this.dateProperties[status];

        if (status === 'tpm_rejected') {
            return 'rejected';
        } else if (status === 'cancelled') {
            return 'cancelled';
        } else if (status === 'tpm_report_rejected') {
            return 'report_rejected';
        } else if (currentStatus === status) {
            return 'active';
        } else if (visit[statusDateField]) {
            return 'completed';
        } else {
            return 'pending';
        }
    },

    _getStatusIndex: function(status, statuses) {
        if (!status || !statuses) { return; }
        if (!this.statusesArray) { this.statusesArray = statuses.map((status) => { return status.value; }); }

        let currentIndex = this.statusesArray.indexOf(status),
            statusIndex = Math.ceil(currentIndex/2);

        return statusIndex >= 0 ? statusIndex : -1;
    },

    setIndex: function(status, statuses) {
        return this._getStatusIndex(status, statuses) + 1;
    },

    hideStatus: function(currentStatus, status) {
        return (status === 'tpm_accepted' && currentStatus === 'tpm_rejected') ||
            (status === 'tpm_rejected' && currentStatus !== 'tpm_rejected') ||
            (status === 'tpm_report_rejected' && currentStatus !== 'tpm_report_rejected') ||
            (status === 'cancelled' && currentStatus !== 'cancelled') ||
            (status === 'tpm_reported' && currentStatus === 'tpm_report_rejected') ||
            (status === 'tpm_rejected' && !currentStatus);
    },

    hideDivider: function(status, statuses) {
        let lastStatus = statuses[statuses.length - 1];
        return !!(lastStatus && lastStatus.value === status);
    },

    _setCancelledPosition: function(status) {
        if (!status || status !== 'cancelled') { return; }
        let cancelledStatus = this.splice('statuses', this.statuses.findIndex(status => status.value === 'cancelled'), 1);
        let lastActiveIndex;
        _.forEachRight(this.statuses, (status, index) => {
            if (lastActiveIndex) { return; }
            let statusDateField = this.dateProperties[status.value];
            if (this.visit[statusDateField]) {
                lastActiveIndex = index;
            }
        });

        this.splice('statuses', lastActiveIndex + 1, 0, cancelledStatus);
    }

});
