'use strict';

Polymer({
    is: 'visits-info-view-main',

    behaviors: [
        TPMBehaviors.PermissionController,
        TPMBehaviors.TextareaMaxRowsBehavior
    ],

    properties: {
        visit: {
            type: Object,
            notify: true
        }
    },

    observers: ['_setPermissionBase(visit.id)'],

    listeners: {
        'action-activated': '_processAction',
        'dialog-confirmed': 'rejectVisit'
    },

    _setPermissionBase: function(id) {
        id = +id;
        if (!id && id !== 0) {
            this.permissionBase = null;
        } else {
            this.permissionBase = `visit_${id}`;
        }
    },

    _processAction: function(event, details) {
        if (!details || !details.type) { throw 'Event type is not provided!'; }
        let message, method;
        switch (details.type) {
            case 'save':
                method = 'PATCH';
                break;
            case 'assign':
                method = 'POST';
                message = 'Assign visit...';
                break;
            case 'reject':
                this.dialogOpened = true;
                return;
            case 'accept':
                method = 'POST';
                message = 'Accepting visit...';
                break;
            case 'send_report':
                method = 'POST';
                message = 'Sending report...';
                break;
            default:
                throw `Unknown event type: ${details.type}`;
        }

        if (this.actionAllowed(`visit_${this.visit.id}`, 'save') && !this.validateVisit()) { return; }

        this.newVisitDetails = {
            method: method,
            id: this.visit.id,
            data: this.getVisitData(),
            message: message,
            action: details.type
        };
    },

    validateVisit: function() {
        return true;
    },

    getVisitData: function() {
        return {};
    },

    rejectVisit: function() {
        if (!this.dialogOpened) { return; }
        let input = this.$.rejectionReasonInput;

        if (!input) { throw 'Can not find input!'; }
        if (!input.validate()) { return; }

        this.newVisitDetails = {
            method: 'POST',
            id: this.visit.id,
            data: {reject_comment: input.value},
            message: 'Reject visit...',
            action: 'reject',
            ignorePatch: true
        };

        this.dialogOpened = false;
    },

    _resetFieldError: function(event) {
        if (!event || !event.target) { return false; }
        event.target.invalid = false;
    },

    _showRejectionReason: function(visit) {
        return visit.status === 'tpm_rejected';
    }

});
