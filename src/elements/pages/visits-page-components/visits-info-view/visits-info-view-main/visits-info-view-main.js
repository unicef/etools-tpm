'use strict';

Polymer({
    is: 'visits-info-view-main',

    behaviors: [
        TPMBehaviors.StaticDataController,
        TPMBehaviors.PermissionController,
        TPMBehaviors.TextareaMaxRowsBehavior,
        TPMBehaviors.CommonMethodsBehavior,
        TPMBehaviors.UserController
    ],

    properties: {
        visit: {
            type: Object,
            notify: true
        },
        comments: {
            type: Array,
            computed: 'reverseComments(visit.report_reject_comments)'
        }
    },

    observers: [
        '_setPermissionBase(visit.id)',
        'resetDialog(dialogOpened)'
    ],

    listeners: {
        'action-activated': '_processAction',
        'dialog-confirmed': 'rejectAction',
        'delete-confirmed': 'cancelVisit',
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
    /* jshint ignore:start */
    _processAction: async function(event, details) {
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
            case 'cancel':
            case 'reject_report':
                this.manageCancellationDialog(details.type);
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
            case 'approve':
                method = 'POST';
                message = 'Approving report...';
            break;
            default:
                throw `Unknown event type: ${details.type}`;
        }

        if (this.actionAllowed(`visit_${this.visit.id}`, 'save') && !this.validateVisit()) { return; }

        let attachmentsTab = Polymer.dom(this.root).querySelector('#attachments');
        let reportTab = Polymer.dom(this.root).querySelector('#report');
        let data = this.getVisitData();

        let visitAttachments = attachmentsTab && await attachmentsTab.getFiles(),
            reportAttachments = reportTab && await reportTab.getFiles();

        if (visitAttachments) { data.attachments = visitAttachments; }
        if (reportAttachments) { data.report = reportAttachments; }

        this.newVisitDetails = {
            method: method,
            id: this.visit.id,
            data: data,
            message: message,
            action: details.type,
            quietUpdate: details.quietUpdate
        };
    },
    /* jshint ignore:end */
    validateVisit: function() {
        return true;
    },

    getVisitData: function() {
        let data = {};
        let visitActivityData = this.$.visitActivity && this.$.visitActivity.getActivitiesData();
        let visitDetailsData = this.$.visitDetails && this.$.visitDetails.getDetailsData();
        if (visitActivityData) {
            data.tpm_activities = visitActivityData;
        }
        if (visitDetailsData) {
            data.sections = visitDetailsData.sections;
            data.unicef_focal_points = visitDetailsData.unicef_focal_points;
            data.offices = visitDetailsData.offices;
            data.tpm_partner_focal_points = visitDetailsData.tpm_partner_focal_points;
        }
        return data;
    },

    rejectAction: function() {
        if (!this.dialogOpened) { return; }
        let input = this.$.rejectionReasonInput;

        if (!input) { throw 'Can not find input!'; }
        if (!input.validate()) { return; }

        let isReport = this.visit.status === 'tpm_reported';

        this.newVisitDetails = {
            method: 'POST',
            id: this.visit.id,
            data: {reject_comment: input.value},
            message: `Reject ${isReport ? 'report' : 'visit'}...`,
            action: `reject${isReport ? '_report' : ''}`,
            ignorePatch: true
        };

        this.dialogOpened = false;
    },

    cancelVisit: function() {
        if (!this.dialogOpened) { return; }

        this.newVisitDetails = {
            method: 'POST',
            id: this.visit.id,
            data: {},
            message: 'Cancel visit...',
            action: 'cancel',
            ignorePatch: true
        };

        this.dialogOpened = false;
    },

    resetDialog: function() {
        this.$.rejectionReasonInput.value = '';
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
    },

    manageCancellationDialog: function(type) {
        if (type === 'reject') {
            this.dialogTitle = 'Reject Visit';
            this.isDeleteDialog = false;
            this.rejectLabel = 'Reject Reason';
        } else if (type === 'cancel') {
            this.dialogTitle = 'Do you want to cancel this visit?';
            this.isDeleteDialog = true;
        } else if (type === 'reject_report') {
            this.dialogTitle = 'Reject Report';
            this.isDeleteDialog = false;
        }
    },

    openCommentsDialog: function() {
        this.commentsDialogOpened = true;
    },

    getCommentDate: function(date) {
        return moment(date).format('DD MMM YYYY');
    },

    showOldComments: function(comments) {
        return comments && comments.length > 1;
    },

    _filterComments: function(comment) {
        return comment.id !== this.visit.report_reject_comments[0].id;
    },

    showRejectionComments: function(comments, status) {
        return comments && comments.length && this.isTpmUser() && status === 'tpm_report_rejected';
    },

    reverseComments: function(comments) {
        return (comments || []).reverse();
    }

});
