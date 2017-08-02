'use strict';

Polymer({
    is: 'visits-info-view-main',

    behaviors: [
        TPMBehaviors.StaticDataController,
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
        'dialog-confirmed': 'rejectVisit',
        'visit-updated': 'visitUpdated'
    },

    ready: function() {
        this.visitFileTypes = this.getData('visit_attachments_types');
        this.reportFileTypes = this.getData('report_attachments_types');

        //add report attachments file types if not exists
        if (!this.reportFileTypes) {
            let reportAttachmentsTypes = this.getChoices(`engagement_${this.visit && this.visit.id}.report.file_type`);
            this._setData('report_attachments_types', reportAttachmentsTypes);
            this.reportFileTypes = reportAttachmentsTypes;
        }
    },

    _setPermissionBase: function(id) {
        id = +id;
        if (!id && id !== 0) {
            this.permissionBase = null;
        } else {
            this.permissionBase = `visit_${id}`;
        }
    },

    _attachmentsReadonly: function(base, type) {
        let readOnly = this.isReadonly(`${base}.${type}`);
        if (readOnly === null) { readOnly = true; }
        return readOnly;
    },

    _showReportTabs: function(permissionBase, visit) {
        if (!permissionBase || !visit) { return false; }

        return this.actionAllowed(permissionBase, 'submit') ||
            visit.status === 'report_submitted' ||
            visit.status === 'final';
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

        let attachmentsTab = Polymer.dom(this.root).querySelector('#attachments');
        let reportTab = Polymer.dom(this.root).querySelector('#report');
        let data = this.getVisitData();
        let promises = [];
        if (attachmentsTab) { promises[0] = attachmentsTab.getFiles(); }
        if (reportTab) { promises[1] = reportTab.getFiles(); }

        Promise.all(promises)
            .then((uploadedFiles) => {
                if (uploadedFiles && uploadedFiles[0]) {data.attachments = uploadedFiles[0]; }
                if (uploadedFiles && uploadedFiles[0]) {data.report = uploadedFiles[1]; }
                this.newVisitDetails = {
                    method: method,
                    id: this.visit.id,
                    data: data,
                    message: message,
                    action: details.type,
                    quietUpdate: details.quietUpdate
                };
            });
    },

    validateVisit: function() {
        return true;
    },

    getVisitData: function() {
        let data = {};
        let visitActivityData = this.$.visitActivity && this.$.visitActivity.getActivitiesData();
        if (visitActivityData) {
            data.tpm_activities = visitActivityData;
        }
        return data;
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
    },

    visitUpdated: function() {
        let visitActivity = this.$.visitActivity;
        if (visitActivity) { visitActivity.visitUpdated('success'); }
    }

});
