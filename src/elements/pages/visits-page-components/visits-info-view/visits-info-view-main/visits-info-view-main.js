'use strict';

Polymer({
    is: 'visits-info-view-main',

    behaviors: [
        etoolsAppConfig.globals,
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
        },
        attachmentsColumns: {
            type: Array,
            value: [{
                'size': 10,
                'label': 'ID',
                'path': 'unique_id'
            }, {
                'size': 40,
                'label': 'Implementing Partner',
                'path': 'implementing_partner.name'
            }, {
                'size': 40,
                'label': 'PD/SSFA ToR',
                'path': 'partnership.title'
            }, {
                'size': 10,
                'name': 'date',
                'label': 'Date',
                'path': 'date'
            }]
        },
        errorObject: {
            type: Object,
            value: function() {
                return {};
            }
        },
        columns: {
            type: Array,
            value: function() {
                return [{
                    'size': 15,
                    'label': 'Id #',
                    'path': 'unique_id'
                }, {
                    'size': 40,
                    'label': 'Implementing Partner',
                    'path': 'implementing_partner.name'
                }, {
                    'size': 45,
                    'label': 'Partnership',
                    'path': 'partnership.title'
                }, {
                    'size': '150px',
                    'label': 'Programmatic Visit',
                    'custom': true,
                    'property': true,
                    'class': 'overflow-visible',
                    'align': 'center',
                    'doNotHide': true
                }];
            }
        }
    },

    observers: [
        '_setPermissionBase(visit.id)',
        'resetDialog(dialogOpened)',
        'resetApprovalDialog(approvalDialog)',
        '_createActivitiesId(visit.tpm_activities)'
    ],

    listeners: {
        'action-activated': '_processAction',
        'delete-confirmed': 'cancelVisit',
        'dialog-confirmed': 'confirmDialog',
    },

    ready: function() {
        this.visitFileTypes = this.getData('visit_attachments_types');
    },

    _setPermissionBase: function(id) {
        id = +id;
        if (!id && id !== 0) {
            this.permissionBase = null;
        } else {
            this.permissionBase = `visit_${id}`;
        }
        this.reportFileTypes = this.getChoices(`${this.permissionBase}.report.file_type`) || [];
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
                this.approvalDialog = true;
                return;
            default:
                throw `Unknown event type: ${details.type}`;
        }

        if (this.actionAllowed(`visit_${this.visit.id}`, 'save') && !this.validateVisit()) { return; }

        let attachmentsTab = Polymer.dom(this.root).querySelector('#attachments');
        let reportTab = Polymer.dom(this.root).querySelector('#report');
        let visitActivity = this.$.visitActivity;
        let data = this.getVisitData();

        let visitAttachments = attachmentsTab && await attachmentsTab.getAttachmentsData();
        let reportAttachments = reportTab && await reportTab.getFiles();
        let visitActivityData = visitActivity && await visitActivity.getActivitiesData();

        if (reportAttachments) { data.report = reportAttachments; }
        if (visitActivityData) { data.tpm_activities = visitActivityData; }
        if (visitAttachments) { data.tpm_activities = visitAttachments; }

        this.newVisitDetails = {
            method: method,
            id: this.visit.id,
            data: data,
            message: message,
            action: details.type,
            quietAdding: details.quietAdding
        };
    },
    /* jshint ignore:end */
    validateVisit: function() {
        return true;
    },

    getVisitData: function() {
        let data = {};
        let visitDetailsData = this.$.visitDetails && this.$.visitDetails.getDetailsData();
        if (visitDetailsData) {
            data.unicef_focal_points = visitDetailsData.unicef_focal_points;
            data.offices = visitDetailsData.offices;
            data.tpm_partner_focal_points = visitDetailsData.tpm_partner_focal_points;
        }
        return data;
    },

    confirmDialog: function() {
        if (this.dialogOpened) {
            this.rejectAction();
        } else {
            this.approveVisit();
        }
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

    approveVisit: function() {
        if (!this.approvalDialog) { return; }

        let data = this._getApproveData();

        this.newVisitDetails = {
            method: 'POST',
            id: this.visit.id,
            data,
            message: 'Approving report...',
            action: 'approve',
            ignorePatch: true
        };

        this.approvalDialog = false;
    },

    _getApproveData: function() {
        let programmaticCheckboxes = Polymer.dom(this.root).querySelectorAll('paper-checkbox.programmatic-visit[checked]');
        let programmaticVisits = programmaticCheckboxes.map(checkbox => +checkbox.getAttribute('activity-id'));

        let data = {mark_as_programmatic_visit: programmaticVisits};

        if (this.sendToUnicef) { data.notify_focal_point = true; }
        if (this.sendToTpm) { data.notify_tpm_partner = true; }
        if (this.approvalComment) { data.approval_comment = this.approvalComment; }

        return data;
    },

    resetDialog: function() {
        this.$.rejectionReasonInput.value = '';
    },

    resetApprovalDialog: function(opened) {
        if (opened) { return; }
        let checkboxes = Polymer.dom(this.root).querySelectorAll('paper-checkbox.programmatic-visit[checked]');
        _.each(checkboxes, checkbox => checkbox.checked = false);
        this.sendToUnicef = false;
        this.sendToTpm = false;
        this.approvalComment = '';
    },

    _resetFieldError: function(event) {
        if (!event || !event.target) { return false; }
        event.target.invalid = false;
    },

    _showRejectionReason: function(visit) {
        return visit.status === 'tpm_rejected';
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
        return comments && comments.length /*&& this.isTpmUser()*/ && status === 'tpm_report_rejected';
    },

    reverseComments: function(comments) {
        return (comments || []).reverse();
    },

    _showTab: function(permissionBase, field) {
        return this.collectionExists(`${permissionBase}.${field}`, 'GET');
    },

    _createActivitiesId: function(activities) {
        if (!activities || !activities.length) { return; }

        this.visit.tpm_activities.forEach((activity, index) => {
            let uniqueId = `000${index + 1}`.slice(-4);
            this.set(`visit.tpm_activities.${index}.unique_id`, uniqueId);
        });
    },
    _setExportLinks: function(visit) {
        return [{
            url: this.getEndpoint('visitDetails', {id: visit.id}).url + 'export_pdf/'
        }];
    }
});
