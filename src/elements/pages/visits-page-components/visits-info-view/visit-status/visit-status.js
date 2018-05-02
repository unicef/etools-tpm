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
        },
        statusesIndex: {
            type: Object,
            value: function() {
                return {
                    draft: 1,
                    assigned: 2,
                    tpm_accepted: 3,
                    tpm_rejected: 3,
                    tpm_reported: 4,
                    tpm_report_rejected: 4,
                    unicef_approved: 5
                };
            },
            readOnly: true
        }
    },

    observers: ['manageStatusesData(visit.status)'],

    ready: function() {
        this.statuses = this.getData('statuses') || [];
    },

    _getStatusClass: function(visit, status) {
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

    setIndex: function(status, currentStatus, indexes) {
        let index = indexes[status];
        return currentStatus === 'cancelled' ? index + 1 : index;
    },

    hideStatus: function(currentStatus, status) {
        let acceptedDate = _.get(this, 'visit.date_of_tpm_accepted'),
            rejectedDate = _.get(this, 'visit.date_of_tpm_rejected'),
            canceledStatus = currentStatus === 'cancelled';

        return (status === 'tpm_accepted' && (currentStatus === 'tpm_rejected' || (canceledStatus && rejectedDate))) ||
            (status === 'tpm_rejected' && currentStatus !== 'tpm_rejected' && (!canceledStatus || acceptedDate || !rejectedDate)) ||
            (status === 'tpm_report_rejected' && currentStatus !== 'tpm_report_rejected') ||
            (status === 'cancelled' && currentStatus !== 'cancelled') ||
            (status === 'tpm_reported' && currentStatus === 'tpm_report_rejected') ||
            (status === 'tpm_rejected' && !currentStatus);
    },

    hideDivider: function(status, statuses) {
        let lastStatus = statuses[statuses.length - 1];
        return !!(lastStatus && lastStatus.value === status);
    },

    manageStatusesData: function(currentStatus) {
        if (!currentStatus) { return; }

        let statuses = this.getData('statuses');
        if (_.isEmpty(this.dateProperties)) { this.setDateProperties(); }

        let cancelledIndex = statuses.findIndex(status => status.value === 'cancelled'),
            cancelledStatus = statuses.splice(cancelledIndex, 1)[0];

        if (currentStatus === 'cancelled') {
            let lastActiveIndex = this.getLastActiveIndex(statuses);
            statuses.splice(lastActiveIndex + 1, 0, cancelledStatus);
        }

        this.set('statuses', statuses);
    },

    setDateProperties: function() {
        _.each(this.statuses, (status) => {
            if (status.value === 'draft') {
                this.set(`dateProperties.draft`, 'date_created');
            } else {
                this.set(`dateProperties.${status.value}`, `date_of_${status.value}`);
            }
        });
    },

    getLastActiveIndex: function(statuses) {
        let lastActiveIndex;
        _.forEachRight(statuses, (status, index) => {
            if (lastActiveIndex) { return; }
            let statusDateField = this.dateProperties[status.value];
            if (this.visit[statusDateField]) {
                lastActiveIndex = index;
            }
        });
        return lastActiveIndex;
    }
});
