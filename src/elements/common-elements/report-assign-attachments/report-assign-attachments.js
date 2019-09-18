'use strict';

Polymer({
    is: 'report-assign-attachments',

    behaviors: [
        TPMBehaviors.DateBehavior,
        TPMBehaviors.StaticDataController,
        TPMBehaviors.TableElementsBehavior,
        TPMBehaviors.CommonMethodsBehavior,
        TPMBehaviors.ActivityToDrD
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
        attachmentsColumns: {
            type: Array,
            value: [{
                'size': 10,
                'label': 'Task No.',
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
    },

    listeners: {
        'dialog-confirmed': '_sendRequest',
        'delete-confirmed': '_sendRequest',
        'delete-assigned-file': 'deleteAssignedFile',
        'attachments-request-completed': '_requestCompleted'
    },

    observers: [
        '_setBasePath(dataBasePath, pathPostfix)',
        '_resetDialog(dialogOpened)',
        '_errorHandler(errorObject)',
        'updateStyles(basePermissionPath, requestInProcess, editedItem.*)',
        'updateTable(dataItems.*)',
        '_setDropdownOptions(dataItems, columns, dataItems.*)',
    ],

    _resetDialog: function(dialogOpened) {
        if (dialogOpened) { return; }
        this.set('errors.file', null);
        this.resetDialog(dialogOpened);
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
        return id && this.dataItems && _.some(this.dataItems, (attachment) => attachment.object_id === id);
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
                object_id: activity
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

    deleteAssignedFile: function(event, detail) {
        let item = this.dataItems.find((item) => {
            return item.id === detail.id;
        });
        let e = {model: {item: item}};

        if (item) {
            this.openDeleteDialog(e);
            this.editedItem._delete = true;
        }
    }
});
