'use strict';

(function() {
    Polymer({
        is: 'file-attachments-tab',

        behaviors: [
            TPMBehaviors.TableElementsBehavior,
            TPMBehaviors.CommonMethodsBehavior,
            TPMBehaviors.ErrorHandlerBehavior
        ],

        properties: {
            dataItems: {
                type: Array,
                value: () => []
            },
            itemModel: {
                type: Object,
                value: function() {
                    return {
                        file: undefined,
                        filename: undefined,
                        file_type: undefined,
                        type: {},
                    };
                }
            },
            headings: {
                type: Array,
                value: () => []
            },
            addDialogTexts: {
                type: Object,
                value: {
                    title: 'Attach File',
                    confirmBtn: 'Attach'
                }
            },
            editDialogTexts: {
                type: Object,
                value: {
                    title: 'Edit Attachment',
                    confirmBtn: 'Edit',
                }
            },
            multiple: {
                type: Boolean,
                value: false
            },
            uploadLabel: {
                type: String,
                value: 'Upload File'
            },
            fileTypes: {
                type: Array,
                value: () => []
            },
            deleteTitle: {
                type: String,
                value: 'Are you sure that you want to delete this attachment?'
            },
            errorProperty: String
        },

        listeners: {
            'dialog-confirmed': '_sendRequest',
            'delete-confirmed': '_sendRequest',
            'attachments-request-completed': '_requestCompleted'
        },

        observers: [
            '_setBasePath(dataBasePath)',
            '_filesChange(dataItems.*, fileTypes.*)',
            '_updateHeadings(basePermissionPath)',
            '_resetDialog(dialogOpened)',
            '_errorHandler(errorObject)',
            'updateStyles(requestInProcess, editedItem, basePermissionPath)',
        ],

        _setBasePath: function(dataBase) {
            let base = dataBase ? `${dataBase}_attachments` : '';
            this.set('basePermissionPath', base);
            if (base) {
                let title = this.getFieldAttribute(base, 'title');
                this.set('tabTitle', title);
                this.fileTypes = this.getChoices(`${base}.file_type`);
            }
        },

        showFileTypes: function(basePath) {
            return !!basePath && this.collectionExists(`${basePath}.file_type`, 'GET');
        },

        _resetDialog: function(dialogOpened) {
            if (!dialogOpened) {
                this.originalEditedObj = null;
            }
            this.resetDialog(dialogOpened);
        },

        _getFileType: function(fileType) {
            let length = _.get(this, 'fileTypes.length');
            if (!length) { return null; }

            let type = this.fileTypes.find((type) => parseInt(type.value, 10) === parseInt(fileType, 10));
            return type || null;
        },

        isTabReadonly: function(basePath) {
            return !basePath || (!this.collectionExists(`${basePath}.PUT`) && !this.collectionExists(`${basePath}.POST`));
        },

        _showAddBtn: function(filesLength, basePath) {
            return !this.isTabReadonly(basePath) && (this.multiple || filesLength === 0);
        },

        _updateHeadings: function(basePermissionPath) {
            let headings = [{
                'size': '150px',
                'name': 'date',
                'label': 'Date Uploaded',
                'labelPath': `created`,
                'path': 'created'
            }, {
                'size': 65,
                'label': 'Document',
                'labelPath': `filename`,
                'property': 'filename',
                'custom': true,
                'doNotHide': false
            }];

            let showFileTypes = this.showFileTypes(basePermissionPath);
            if (showFileTypes) {
                headings.splice(1, 0, {
                    'size': 35,
                    'label': 'Document Type',
                    'labelPath': `file_type`,
                    'path': 'display_name'
                });
            }

            this.set('headings', headings);
        },

        _openFileChooser: function() {
            let elem = Polymer.dom(this.root).querySelector('#fileInput');
            if (elem && document.createEvent) {
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('click', true, false);
                elem.dispatchEvent(evt);
                this.set('errors.file', '');
            }
        },

        _fileSelected: function(e) {
            if (!e || !e.target) { return false; }

            let files = e.target.files || {};
            let file = files[0];

            if (file && file instanceof File) {
                this.set('editedItem.filename', file.name);
                this.editedItem.file = file;

                return !this._fileAlreadySelected();
            }
        },

        _filesChange: function() {
            if (!this.dataItems) { return false; }

            this.dataItems.forEach((file) => {
                if (file.file_type !== undefined && !file.display_name) {
                    let type = this._getFileType(file.file_type) || {};
                    file.type = type;
                    file.display_name = type.display_name;
                }
            });

            if (!this.multiple && this.dataItems instanceof Array && this.dataItems.length > 1) {
                this.set('dataItems', [this.dataItems[0]]);
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
                method = attachmentsData.id ? 'PATCH' : 'POST';
            }

            attachmentsData = method === 'PATCH' ? this._getChanges(attachmentsData) : attachmentsData;
            if (!attachmentsData) {
                this._requestCompleted(null, {success: true});
                return;
            }

            this.requestData = {method, attachmentsData};
        },

        _getChanges: function(attachmentsData) {
            let original = this.originalEditedObj && this._getFileData(this.originalEditedObj);
            if (!original) { return attachmentsData; }

            let data = _.pickBy(attachmentsData, (value, key) => original[key] !== value);
            if (data.file && this._fileAlreadySelected()) {
                delete data.file;
            }

            if (_.isEmpty(data)) {
                return null;
            } else {
                data.id = attachmentsData.id;
                return data;
            }
        },

        _getFileData: function(fileData) {
            if (!this.dialogOpened) { return {}; }
            let {id, file, type} = fileData || this.editedItem,
                data = {file};

            if (id) {
                data.id = id;
            }

            if (type) {
                data.file_type = type.value;
            }

            return data;
        },

        _requestCompleted: function(event, detail = {}) {
            this.requestInProcess = false;
            if (detail.success) {
                this.dialogOpened = false;
            }
        },

        _fileAlreadySelected: function() {
            if (!this.dataItems) {return false;}

            let alreadySelectedIndex = this.dataItems.findIndex((file) => {
                return file.filename === this.editedItem.filename;
            });

            if (alreadySelectedIndex !== -1) {
                this.set('errors.file', 'File already selected');
                return true;
            }

            this.set('errors.file', '');
            return false;
        },

        validate: function() {
            let dropdown = Polymer.dom(this.root).querySelector('#fileType');
            let editedItem = this.editedItem;
            let valid = true;

            let fileTypeRequired = this._setRequired('file_type', this.basePermissionPath);
            if (fileTypeRequired && (!this.fileTypes || !this.fileTypes.length)) {
                this.set('errors.file_type', 'File types are not defined');
                valid = false;
            } else {
                this.set('errors.file_type', false);
            }

            if (fileTypeRequired && !dropdown.validate()) {
                this.set('errors.file_type', 'This field is required');
                valid = false;
            }

            if (this.addDialog && this._fileAlreadySelected()) {
                valid = false;
            }

            if (this.addDialog && !editedItem.file) {
                this.set('errors.file', 'File is not selected');
                valid = false;
            }

            return valid;
        },

        _errorHandler: function(errorData) {
            let mainProperty = this.errorProperty;
            this.requestInProcess = false;
            if (!errorData || !errorData[mainProperty]) { return; }
            let refactoredData = this.refactorErrorObject(errorData[mainProperty]);
            let nonField = this.checkNonField(errorData[mainProperty]);

            if (this.dialogOpened && typeof refactoredData[0] === 'object') {
                this.set('errors', refactoredData[0]);
            }
            if (typeof errorData[mainProperty] === 'string') {
                this.fire('toast', {text: `Attachments: ${errorData[mainProperty]}`});
            }
            if (nonField) {
                this.fire('toast', {text: `Attachments: ${nonField}`});
            }

            if (!this.dialogOpened) {
                let filesErrors = this.getFilesErrors(refactoredData);

                filesErrors.forEach((fileError) => {
                    this.fire('toast', {text: `${fileError.fileName}: ${fileError.error}`});
                });
            }
        },

        getFilesErrors: function(errors) {
            if (this.dataItems instanceof Array && errors instanceof Array && errors.length === this.dataItems.length) {
                let filesErrors = [];

                errors.forEach((error, index) => {
                    let fileName = this.dataItems[index].filename;
                    fileName = this._cutFileName(fileName);

                    if (fileName && typeof error.file === 'string') {
                        filesErrors.push({
                            fileName: fileName,
                            error: error.file
                        });
                    }
                });

                return filesErrors;
            }

            return [];
        },

        _cutFileName: function(fileName) {
            if (typeof fileName !== 'string') {
                return;
            }

            if (fileName.length <= 20) {
                return fileName;
            } else {
                return fileName.slice(0, 10) + '...' + fileName.slice(-7);
            }
        },
    });
})();
