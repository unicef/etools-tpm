'use strict';

Polymer({
    is: 'assign-attachments',

    behaviors: [
        TPMBehaviors.DateBehavior,
        TPMBehaviors.StaticDataController,
        TPMBehaviors.TableElementsBehavior,
        TPMBehaviors.CommonMethodsBehavior,
        TPMBehaviors.ActivityToDrD,
        TPMBehaviors.DateBehavior,
        /*jshint ignore:start*/
        EtoolsAjaxRequestBehavior,
        /*jshint ignore:end*/
        etoolsAppConfig.globals,
    ],

    properties: {
        basePermissionPath: String,
        dataBasePath: String,
        pathPostfix: String,
        itemModel: {
            type: Object,
            value: function() {
                return {
                    file_type: undefined,
                    activity: undefined,
                    fileData: {},
                };
            }
        },
        columnsForTaskLabel: {
            type: Array,
            value: [{
                'label': 'Related Task',
                'path': 'unique_id'
            }, {
                'label': 'Document Type',
                'path': 'partner.name'
            }, {
                'label': 'Document',
                'path': 'intervention.title'
            }, {
                'name': 'date',
                'label': 'Date Uploaded',
                'path': 'date'
            }]
        },
        attachmentsColumns: {
            type: Array,
            value: [{
                'size': 40,
                'label': 'Document Type',
                'path': 'file_type',
            }, {
                'size': 40,
                'label': 'Document',
                'labelPath': 'tpm_activities.intervention',
                'path': 'intervention.title'
            }, {
                'size': 10,
                'name': 'date',
                'label': 'Date Uploaded',
                'labelPath': 'tpm_activities.date',
                'path': 'date'
            },
            {
                'size': 10,
                'label': 'Source',
                'labelPath': 'tpm_activities.date',
                'path': 'source'
            },
        ]
        },
        attachmentsHeadings: {
            type: Array,
            value: [{
                'size': 22,
                'label': 'Related Task',
            }, {
                'size': 18,
                'label': 'Document Type',
            }, {
                'size': '',
                'class': 'header-document',
                'label': 'Document',
            }, {
                'size': 15,
                'label': 'Date Uploaded',
            },
            {
                'size': 10,
                'label': 'Source',
            },
        ]
        },
        activities: {
            type: Array,
            value: () => []
        },
        dataItems: {
            type: Array,
            value: () => []
        },
        columns: {
            type: Array,
            value: []
        },
        details: {
            type: Array,
            value: [{}],
        },
        fileTypes: {
            type: Array,
            value: []
        },
        addDialogTexts: {
            type: Object,
            value: function() {
                return {
                    title: 'Attach File'
                };
            }
        },
        deleteTitle: {
            type: String,
            value: 'Are you sure that you want to delete this file?'
        },
        dropdownOptions: {
            type: Array,
            value: () => []
        },
        shareDialogOpened: {
            type: Boolean,
            value: false
        },
        shareParams: {
            type: Object,
        },
        selectedAttachments: {
            type: Array
        },
        confirmDisabled: {
            type: Boolean,
        },
        requestOptions: {
            value: {
                csrf: true
            }
        },
        fileTypeDropdownDisabled: {
            type: Boolean,
            value: false
        },
        linkedAttachments: {
            type: Array,
            value: [],
            notify: true
        },
        linkedAttachmentsInit: {
            type: Boolean,
            value: false
        }
    },

    listeners: {
        'dialog-confirmed': '_sendRequest',
        'delete-confirmed': '_sendRequest',
        'delete-assigned-file': 'deleteAssignedFile',
        'attachments-request-completed': '_requestCompleted'
    },

    observers: [
        '_setBasePath(dataBasePath, pathPostfix)',
        '_baseIdChanged(baseId)',
        '_getPartnerOrganizations(dataBasePath)',
        '_resetDialog(dialogOpened)',
        '_resetShareDialog(shareDialogOpened)',
        '_errorHandler(errorObject)',
        'updateStyles(basePermissionPath, requestInProcess, editedItem.*)',
        'updateTable(dataItems.*, linkedAttachments.*)',
        '_setDropdownOptions(dataItems, columns, dataItems.*)',
    ],

    _getPartnerOrganizations: function() {
        this.partnerOrganizations = this.getData('partnerOrganizations');
    },

    _baseIdChanged: function(id) {
        if (!isNaN(id) && !this.linkedAttachmentsInit) {
            this._getLinkedAttachments();
            this.set('linkedAttachmentsInit', true);
        }
    },

    _getLinkedAttachments: function() {
        const options = {
            endpoint: this.getEndpoint('attachmentLinksForVisit', {id: this.baseId}),
            csrf: true,
        };
        this.set('requestInProcess', true);
        this.sendRequest(options).then(response => {
            this.set('linkedAttachments', response);
            this.set('requestInProcess', false);
        });
    },

    _resetDialog: function(dialogOpened) {
        if (dialogOpened) { return; }
        this.set('errors.file', null);
        this.resetDialog(dialogOpened);
    },

    _resetShareDialog: function(opened) {
        if (opened) { return; }
        this.resetDialog(opened, this.$.shareDocuments.shadowRoot);
        this.$.shareDocuments.resetValues();
    },

    updateTable: function() {
        this.$['activity-repeat'].render();
    },

    _setBasePath: function(dataBase, pathPostfix) {
        let base = dataBase && pathPostfix ? `${dataBase}_${pathPostfix}` : '';
        this.set('basePermissionPath', base);
        if (base) {
            let title = this.getFieldAttribute(base, 'title');
            this.set('tabTitle', title);
            this.fileTypes = this.getChoices(`${base}.file_type`);
        }
    },

    isTabReadonly: function(basePath) {
        return !basePath || (!this.collectionExists(`${basePath}.PUT`) && !this.collectionExists(`${basePath}.POST`));
    },

    showActivity: function(activityTask) {
        let id = activityTask && activityTask.id;
        const hasAttachments = id && this.dataItems && _.some(this.dataItems, (attachment) => attachment.object_id === id);
        const hasLinkedAttachments = id && this.linkedAttachments && _.some(this.linkedAttachments, attachment => attachment.activity_id === id);
        return hasAttachments || hasLinkedAttachments;
    },

    _isReadOnly: function(field, basePermissionPath, inProcess) {
        if (!basePermissionPath || inProcess) { return true; }
        let path = field ? `${basePermissionPath}.${field}` : basePermissionPath;

        let readOnly = this.isReadonly(path);
        if (readOnly === null) { readOnly = true; }

        return readOnly;
    },

    _openAddDialog: function() {
        this.editedItem = _.clone(this.itemModel);
        this.openAddDialog();
    },

    _openShareDialog: function() {
        this.shareDialogOpened = true;
        this.set('confirmDisabled', true);
    },

    _handleDropdownPermissions: function(e, detail) {
        if (!this.partnerOrganizations) {
            return;
        }
        const partner = this.partnerOrganizations.find(partner=> partner.id === _.get(detail, 'selectedValues.partner.id'));
        if (!partner) { return; }
        if (partner.partner_type === 'Civil Society Organization') {
            const otherType = this.fileTypes.find(fileType=> fileType.display_name === 'Other');
            this.set('editedItem.file_type', otherType);
            this.set('fileTypeDropdownDisabled', true);
        } else {
            this.set('editedItem.file_type', {});
            this.set('fileTypeDropdownDisabled', false);
        }
    },

    _sendRequest: function() {
        if (!this.dialogOpened || !this.validate()) { return; }

        this.requestInProcess = true;
        let attachmentsData, method;

        if (this.deleteDialog) {
            attachmentsData = {id: this.editedItem.id};
            method = 'DELETE';
        } else {
            attachmentsData = this._getFileData();
            method =  'POST';
        }

        this.requestData = {method, attachmentsData};
    },

    _getFileData: function() {
        if (!this.dialogOpened) { return {}; }
        let {fileData, file_type: fileType, activity} = this.editedItem,
            data = {
                file: fileData.file,
                object_id: activity.id
            };

        if (fileType) {
            data.file_type = fileType.value;
        }

        return data;
    },

    _requestCompleted: function(event, detail = {}) {
        this.requestInProcess = false;
        if (detail.success) {
            this.dialogOpened = false;
        }
        this._getLinkedAttachments();
    },

    _errorHandler: function(errorData) {
        this.requestInProcess = false;

        let fullErrorPath = `${this.parentProperty}.0.${this.filesProperty}`;
        let error = _.get(errorData, fullErrorPath);
        if (!error) { return; }

        let nonField = this.checkNonField(errorData);
        if (nonField) {
            this.fire('toast', {text: `Attachments: ${nonField}`});
        }

        let errorPath = this.dialogOpened ? fullErrorPath : this.parentProperty;
        let attachmentsErrorData = _.get(errorData, errorPath);
        if (!attachmentsErrorData) { return; }

        if (this.dialogOpened) {
            let refactoredData = this.refactorErrorObject(attachmentsErrorData);
            this.set('errors', refactoredData);
        } else {
            this.handleErrors(attachmentsErrorData);
        }
    },

    handleErrors: function(errorData) {
        if (!Array.isArray(errorData)) { return; }

        errorData.forEach((item) => {
            let activity = this.dropdownOptions.find((option) => {
                return +option.id === +item.id;
            });

            if (activity && activity.name) {
                this.fire('toast', {text: `Attach files for ${activity.name}`});
            }
        });
    },

    deleteAssignedFile: function(event) {
        let itemId = event.model.attachment.id;
        let item = this.dataItems.find((item) => {
            return item.id === itemId;
        });
        let e = {model: {item: item}};

        if (item) {
            this.openDeleteDialog(e);
            this.editedItem._delete = true;
        }
    },

    _isAttachmentForTask: function(activity) {
        return attachment => attachment.object_id === activity.id;
    },

    _isLinkedAttachmentForTask: function(activity) {
        return attachment => attachment.activity_id === activity.id;
    },

    _getAttachmentType: function(attachment) {
        return this.fileTypes.find(fileType => fileType.value === attachment.file_type).display_name;
    },

    getDate: function(item) {
        return this.prettyDate(item && item.created) || '--';
    },

    _SendShareRequest: function() {
        const {id, attachments} = this.shareParams;
        const options = {
            endpoint: this.getEndpoint('linkActivityAttachments', {id}),
            csrf: true,
            body:  {attachments} ,
            method: 'POST'
        };
        this.set('requestInProcess', true);
        this.sendRequest(options)
            .then(() => {
                this.fire('toast', {
                    text: 'Documents shared successfully.'
                });
                this.shareReqFinished();
            })
            .catch(this._handleShareError.bind(this));
    },

    shareReqFinished: function() {
        this.set('requestInProcess', false);
        this.set('shareDialogOpened', false);
        this._getLinkedAttachments(); // refresh the list
    },

    _handleShareError: function(err) {
        let nonField = this.checkNonField(err);
        let message;
        if (nonField) {
            message = `Nonfield error: ${nonField}`;
        } else {
            message = err.response && err.response.detail ? `Error: ${err.response.detail}`
            : 'Error sharing documents.';
        }
        this.fire('toast', {
            text: message
        });
        this.shareReqFinished();
    },

    _getFilteredTasks: function(activities, columnsForTaskLabel) {
        return this._getATOptions(activities, columnsForTaskLabel);
    },

    _openDeleteLinkDialog: function(e) {
        const {linkedAttachment} = e.model;
        this.set('linkToDeleteId', linkedAttachment.id);
        this.deleteLinkOpened = true;
    },

    _removeLink: function({detail}) {
        this.deleteLinkOpened = false;
        const id = detail.dialogName;
        this.sendRequest({
            method: 'DELETE',
            endpoint: this.getEndpoint('linkAttachment', {id})
        }).then(this._getLinkedAttachments.bind(this))
        .catch(err=>console.log(err));
    }
});
