'use strict';

Polymer({
    is: 'assign-attachments',

    behaviors: [
        TPMBehaviors.DateBehavior,
        TPMBehaviors.StaticDataController,
        TPMBehaviors.TableElementsBehavior,
        TPMBehaviors.CommonMethodsBehavior,
    ],

    properties: {
        basePermissionPath: {
            type: String,
        },
        attachmentsBase: {
            type: String,
        },
        attachmentsPath: {
            type: String,
        },
        filesProperty: {
            type: String,
        },
        itemModel: {
            type: Object,
            value: function() {
                return {
                    file_type: {
                        value: null,
                        display_name: '',
                    },
                    activity: {
                        id: null,
                        name: '',
                    },
                    files: [],
                };
            }
        },
        columns: {
            type: Array,
            value: []
        },
        details: {
            type: Array,
            value: function() {
                return [{
                    'size': '100px',
                    'name': 'date',
                    'label': 'Date Uploaded',
                    'labelPath': `created`,
                    'path': 'created'
                }, {
                    'size': 35,
                    'label': 'Document Type',
                    'labelPath': `file_type`,
                    'path': 'display_name'
                }, {
                    'size': 65,
                    'label': 'File Attachment',
                    'labelPath': `file`,
                    'property': 'file_name',
                    'custom': true,
                    'doNotHide': false
                }];
            }
        },
        fileTypes: {
            type: Array,
            value: []
        },
        dialogDropdownLabel: {
            type: String,
        },
        dropdownOptions: {
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
    },

    listeners: {
        'dialog-confirmed': '_addItemFromDialog',
        'delete-confirmed': 'removeItem',
        'delete-assigned-file': 'deleteAssignedFile'
    },

    observers: [
        'resetDialog(dialogOpened)',
        '_errorHandler(errorObject)',
        'updateStyles(attachmentsBase, requestInProcess, editedItem.*)',
        '_setAttachmentsBase(basePermissionPath, attachmentsPath)',
        '_setDropdownOptions(dataItems, columns)',
    ],

    _setAttachmentsBase: function(basePermissionPath, attachmentsPath) {
        this.set('attachmentsBase', `${basePermissionPath}.${attachmentsPath}`);
    },

    _isReadOnly: function(field, basePermissionPath, inProcess) {
        if (!basePermissionPath || inProcess) { return true; }
        let path = field ? `${basePermissionPath}.${field}` : basePermissionPath;

        let readOnly = this.isReadonly(path);
        if (readOnly === null) { readOnly = true; }

        return readOnly;
    },

    _setDropdownOptions: function(dataItems, columns) {
        if (!Array.isArray(dataItems) || !Array.isArray(columns)) { return; }
        let options = [];
        let fields;
        let fieldValue;

        dataItems.forEach((item) => {
            if (!item || !item.id) { return; }
            fields = [];

            columns.forEach((column) => {
                fieldValue = _.get(item, column && column.path);

                if (typeof fieldValue === 'string' && fieldValue.length > 20) {
                    fieldValue = this.truncateLongString(fieldValue);
                }
                if (column.name === 'date') {
                    fieldValue = this.prettyDate(fieldValue);
                }

                fields.push(fieldValue || '--');
            });

            options.push({
                id: item.id,
                name: fields.join(' / '),
            });
        });

        this.set('dropdownOptions', options);
    },

    truncateLongString: function(value) {
        if (typeof value !== 'string') { return; }
        let trimmedValue = value.replace(/^(.{20}[^\s]*).*/, '$1');
        return (value.length === trimmedValue.length) ? trimmedValue : `${trimmedValue} ...`;
    },

    _errorHandler: function(errorData) {
        this.requestInProcess = false;
        let nonField = this.checkNonField(errorData);

        if (nonField) {
            this.fire('toast', {text: `Attachments: ${nonField}`});
        }

        errorData = _.get(errorData, this.attachmentsPath.replace('.', '.0.'));
        if (!errorData) { return; }
        let refactoredData = this.dialogOpened ? this.refactorErrorObject(errorData) : this.refactorErrorObject(errorData)[0];
        this.set('errors', refactoredData);
    },

    deleteAssignedFile: function(event, detail) {
        let item = this.dataItems.find((item) => {
            return item.id === detail.parentId;
        });
        let e = {model: {item: item}};

        if (item) {
            this.openDeleteDialog(e);
            this.removedFileData = detail;
        }
    },

    removeItem: function() {
        if (this.editedItem && this.editedItem.id !== undefined) {
            this.editedItem._delete = true;
            this._addItemFromDialog();
        }
        this.confirmDialogOpened = false;
    },

    getAttachmentsData: function() {
        if (!this.dialogOpened) { return null; }

        if (this.removedFileData && this.editedItem && this.editedItem._delete) {
            return [{
                id: this.removedFileData.parentId,
                [this.filesProperty]: [{
                    id: this.removedFileData.fileId,
                    hyperlink: this.removedFileData.hyperlink,
                    _delete: true,
                }]
            }];
        }

        return new Promise((resolve, reject) => {
            this.$.fileUpload.getFiles()
                .then((files) => {
                    let data = {};
                    let fileTypeId = _.get(this.editedItem, 'file_type.value');

                    data[this.filesProperty] = files;
                    _.set(data, `${this.filesProperty}.0.file_type`, fileTypeId);
                    data.id = _.get(this.editedItem, 'activity.id');

                    resolve([data]);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
});
