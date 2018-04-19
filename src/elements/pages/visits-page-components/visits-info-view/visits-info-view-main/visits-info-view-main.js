'use strict';

Polymer({
    is: 'visits-info-view-main',

    behaviors: [
        etoolsAppConfig.globals,
        TPMBehaviors.StaticDataController,
        TPMBehaviors.PermissionController,
        TPMBehaviors.TextareaMaxRowsBehavior,
        TPMBehaviors.CommonMethodsBehavior,
        TPMBehaviors.UserController,
        TPMBehaviors.RouterBehavior
    ],

    properties: {
        tabsList: {
            type: Array,
            value: function() {
                return ['details', 'report', 'action-points', 'attachments'];
            }
        },
        tabsListExt: {
            type: Array,
            value: function() {
                return [
                    {
                        'name': 'report',
                        'path': 'tpm_activities.report_attachments'
                    },
                    {
                        'name': 'action-points',
                        'path': 'action_points'
                    }
                ];
            }
        },
        pagePrefix: {
            type: String,
            value: '/visits'
        },
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
                'label': 'Activity Id',
                'labelPath': 'tpm_activities.id',
                'path': 'unique_id'
            }, {
                'size': 40,
                'label': 'Implementing Partner',
                'labelPath': 'tpm_activities.partner',
                'path': 'partner.name'
            }, {
                'size': 40,
                'label': 'PD/SSFA ToR',
                'labelPath': 'tpm_activities.intervention',
                'path': 'intervention.title'
            }, {
                'size': 10,
                'name': 'date',
                'label': 'Date',
                'labelPath': 'tpm_activities.date',
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
                    'labelPath': 'tpm_activities.id',
                    'path': 'unique_id'
                }, {
                    'size': 40,
                    'label': 'Implementing Partner',
                    'labelPath': 'tpm_activities.partner',
                    'path': 'partner.name'
                }, {
                    'size': 45,
                    'label': 'Partnership',
                    'labelPath': 'tpm_activities.partnership',
                    'path': 'partnership.title'
                }, {
                    'size': '150px',
                    'label': 'HACT Programmatic Visit',
                    'custom': true,
                    'property': true,
                    'class': 'overflow-visible',
                    'align': 'center',
                    'doNotHide': true
                }];
            }
        },
        details: {
            type: Array,
            value: function() {
                return [{
                    'size': 100,
                    'name': 'styled_array',
                    'property': 'name',
                    'options': {
                        'delimiter': '[',
                        'style': 'font-weight: 500;',
                    },
                    'html': 'true',
                    'label': 'Locations',
                    'labelPath': 'tpm_activities.locations',
                    'path': 'locations',
                }];
            }
        },
    },

    observers: [
        '_setPermissionBase(visit.id)',
        '_routeConfig(route)',
        '_checkAvailableTab(permissionBase, route)',
        'resetDialog(dialogOpened)',
        'resetApprovalDialog(approvalDialog)',
        '_createActivitiesId(visit.tpm_activities)',
        '_errorOccurred(errorObject)'
    ],

    listeners: {
        'action-activated': '_processAction',
        'delete-confirmed': 'cancelVisit',
        'dialog-confirmed': 'confirmDialog',
        'visit-updated': 'notifyAboutLetter'
    },

    ready: function() {
        this.visitFileTypes = this.getData('visit_attachments_types') || [];
    },

    _setPermissionBase: function(id) {
        id = +id;
        if (!id && id !== 0) {
            this.permissionBase = null;
        } else {
            this.permissionBase = `visit_${id}`;
        }
        this.reportFileTypes = this.getChoices(`${this.permissionBase}.tpm_activities.report_attachments.file_type`) || [];
        this.simpleFileTypes = this.getChoices(`${this.permissionBase}.report_attachments.file_type`) || [];
        this.actionPointStatues = this.getChoices(`${this.permissionBase}.action_points.status`) || [];
    },

    _attachmentsReadonly: function(base, type) {
        let readOnly = this.isReadonly(`${base}.${type}`);
        if (readOnly === null) {
            readOnly = true;
        }
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
                this.manageCancellationDialog(details.type);
                this.dialogOpened = true;
                return;
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
        let simpleAttachmentsTab = Polymer.dom(this.root).querySelector('#simpleAttachments');
        let visitActivity = this.$.visitActivity;
        let actionPoints = Polymer.dom(this.root).querySelector('#actionPoints');

        let data = this.getVisitData();

        let visitAttachments = attachmentsTab && await attachmentsTab.getAttachmentsData();
        let reportAttachments = reportTab && await reportTab.getAttachmentsData();
        let simpleAttachments = simpleAttachmentsTab && await simpleAttachmentsTab.getFiles();
        let visitActivityData = visitActivity && await visitActivity.getActivitiesData();
        let actionPointsData = actionPoints && await actionPoints.getTabData();

        if (reportAttachments) { data.tpm_activities = reportAttachments; }
        if (visitActivityData) { data.tpm_activities = visitActivityData; }
        if (visitAttachments) { data.tpm_activities = visitAttachments; }
        if (simpleAttachments) { data.report_attachments = simpleAttachments; }
        if (actionPointsData) { data.action_points = actionPointsData; }

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
        _.assign(data, visitDetailsData);
        return data;
    },

    confirmDialog: function(e, details) {
        if (this.dialogOpened) {
            if (details.dialogName === 'reject') {
                this.rejectAction();
            } else if (details.dialogName === 'cancel') {
                this.cancelVisit();
            }
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

        this.isRejectReportDialog = false;
        this.dialogOpened = false;
    },

    cancelVisit: function() {
        if (!this.dialogOpened) { return; }

        let data = {};
        if (this.visit.status !== 'draft') {
            let input = this.$.rejectionReasonInput;
            if (!input) { throw 'Can not find input!'; }
            if (!input.validate()) { return; }
            data = {reject_comment: input.value};
        }

        this.newVisitDetails = {
            method: 'POST',
            id: this.visit.id,
            data: data,
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
            this.rejectField = 'report_reject_comments.reject_reason';
            this.rejectConfirm = 'Continue';
            this.dialogName = 'reject';
        } else if (type === 'cancel') {
            this.dialogTitle = 'Do you want to cancel this visit?';
            this.rejectField = 'cancel_comment';
            this.rejectConfirm = 'Continue';
            this.dialogName = 'cancel';
            this.isDeleteDialog = this.visit.status === 'draft';
        } else if (type === 'reject_report') {
            this.isRejectReportDialog = true;
            let title = `Report for ${this.visit.reference_number}`;
            if (this.visit.start_date && this.visit.end_date) {
                title += `${this.visit.start_date} - ${this.visit.end_date}`;
            }
            this.dialogTitle = title;
            this.rejectConfirm = 'Send back to TPM';
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

    showRejectComments: function(comments, isRejectReportDialog) {
        return isRejectReportDialog && comments && comments.length;
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

    _isApplicable: function(item) {
        return item && item.pv_applicable;
    },

    _setLetterLink: function(visit) {
        let statuses = ['draft', 'assigned', 'cancelled', 'tpm_rejected'];
        if (!visit || !this.isTpmUser() || !!~statuses.indexOf(visit.status)) { return; }
        return this.getEndpoint('visitDetails', {id: visit.id}).url + 'visit-letter/';
    },

    notifyAboutLetter: function(event) {
        let visitAccepted = event && event.detail && event.detail.visitAccepted;
        if (visitAccepted) {
            this.fire('toast', {text: 'Visit letter is generated. You can download it from top right corner at any time.'});
        }
    },

    setVisitTitle: function(number) {
        return number || 'Assign TPM Visit';
    },

    _getLinks: function(visit, permissionBase) {
        if (!visit || !this._showTab(permissionBase, 'action_points')) { return; }
        return [{
            name: 'Export Action Points',
            url: this.getEndpoint('visitDetails', {id: visit.id}).url + 'action-points/export/',
            useDropdown: true
        }];
    }
});
