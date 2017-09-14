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
        parentProperty: {
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
            value: [{}],
        },
        fileTypes: {
            type: Array,
            value: []
        },
        title: {
            type: String,
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
        '_setAttachmentsBase(basePermissionPath, parentProperty, filesProperty)',
        '_setDropdownOptions(dataItems, columns, dataItems.*)',
    ],

    _setAttachmentsBase: function(basePermissionPath, parentProperty, filesProperty) {
        this.set('attachmentsBase', `${basePermissionPath}.${parentProperty}.${filesProperty}`);
    },

    showActivity: function(item) {
        return item && item[this.filesProperty] && item[this.filesProperty].length;
    },

    _isReadOnly: function(field, basePermissionPath, inProcess) {
        if (!basePermissionPath || inProcess) { return true; }
        let path = field ? `${basePermissionPath}.${field}` : basePermissionPath;

        let readOnly = this.isReadonly(path);
        if (readOnly === null) { readOnly = true; }

        return readOnly;
    },

    isAttachmentsEmpty: function(dataItems) {
        if (!Array.isArray(dataItems) || !dataItems.length) { return true; }

        return !dataItems.some((item) => {
            return this.showActivity(item);
        });
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
