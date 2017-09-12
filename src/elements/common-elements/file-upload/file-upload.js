'use strict';

(function() {
    Polymer({
        is: 'file-upload',

        properties: {
            label: {
                type: String,
                value: 'File Attachments'
            },
            uploadLabel: {
                type: String,
                value: 'Upload File'
            },
            required: {
                type: Boolean,
                value: false
            },
            readonly: {
                type: Boolean,
                value: false
            },
            disabled: {
                type: Boolean,
                value: false
            },
            multiple: {
                type: Boolean,
                value: false
            },
            allowDelete: {
                type: Boolean,
                value: false
            },
            files: {
                type: Array,
                value: function() {
                    return [];
                }
            },
            deletedFiles: {
                type: Array,
                value: function() {
                    return [];
                }
            },
            errors: {
                type: Object,
                value: {},
            },
        },

        observers: [
            '_setErrorMessages(errors)',
        ],

        reset: function() {
            this.deletedFiles = [];
        },

        _resetFieldError: function(event) {
            event.target.invalid = false;
        },

        _setErrorMessages: function(errors) {
            if (!errors || !this.files) { return; }

            this.files.forEach((file, index) => {
                let errorMessage = this.get(`errors.${index}.file`);
                this.set(`files.${index}.invalid`, !!errorMessage);
                this.set(`files.${index}.error`, errorMessage);
            });
        },

        validate: function() {
            if (this.required && !this.files.length) {
                this.set('files.error', 'File is not selected');
                return false;
            }

            this.set('files.error', null);
            return true;
        },

        _hideUploadButton: function(multiple, readonly, filesLength) {
            return readonly || (!multiple && filesLength);
        },

        _hideDeleteBtn: function(allowDelete, disabled, readonly) {
            return !allowDelete || disabled || readonly;
        },

        _openFileChooser: function(e) {
            let elem = Polymer.dom(this.root).querySelector('#fileInput');
            let index = e && e.model && e.model.index;

            if (elem && document.createEvent) {
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('click', true, false);
                elem.dispatchEvent(evt);
                this.editedIndex = index;
                this.set('files.error', null);
            }
        },

        _fileSelected: function(e) {
            if (!e || !e.target) { return; }

            let files = e.target.files || {};
            let file = files[0];
            if (!(file instanceof File)) { return; }

            let newFile = {
                raw: file,
                file_name: file.name
            };

            if (this.editedIndex || this.editedIndex === 0) {
                this._editFile(newFile);
            } else {
                this.push('files', newFile);
            }

            e.target.value = '';
        },

        _editFile: function(newFile) {
            let editedFile = this.files[this.editedIndex] || {};

            if (editedFile && editedFile.id) {
                newFile._edit = true;
                newFile.id = editedFile.id;
            }

            this.splice('files', this.editedIndex, 1, newFile);
        },

        _deleteFile: function(e) {
            let index = e && e.model && e.model.index;
            if (!index && index !== 0) { return; }

            let deletedFile = this.files[index] || {};
            this.splice('files', index, 1);

            if (deletedFile && deletedFile.id) {
                this.deletedFiles.push({
                    id: deletedFile.id,
                    hyperlink: deletedFile.file,
                    _delete: true,
                });
            }

            e.stopImmediatePropagation();
        },

        _getFileName: function(file) {
            return (file && file.file_name) ? file.file_name : this._getFilenameFromUrl(file.file);
        },

        _getFilenameFromUrl: function(url) {
            if (typeof url !== 'string' || !url) {
                return;
            }

            return url.split('/').pop();
        },

        _getUploadedFile: function(fileModel) {
            return new Promise((resolve, reject) => {
                let reader = new FileReader();
                let uploadedFile = {
                    id: fileModel.id,
                    file_name: fileModel.file_name,
                };

                try {
                    reader.readAsDataURL(fileModel.raw);
                } catch (error) {
                    reject(error);
                }

                reader.onload = function() {
                    uploadedFile.file = reader.result;
                    resolve(uploadedFile);
                };

                reader.onerror = function(error) {
                    reject(error);
                };
            });
        },

        getFiles: function() {
            return new Promise((resolve, reject) => {
                let files = this.files || [];

                files = files.filter((file) => {
                    return file && (file._edit || file.id === undefined);
                });

                let promises = files.map((fileModel) => {
                    if (fileModel && fileModel.raw) {
                        return this._getUploadedFile(fileModel);
                    }
                });

                promises = promises.filter((promise) => {
                    return promise !== undefined;
                });

                Promise.all(promises)
                    .then((uploadedFiles) => {
                        uploadedFiles = uploadedFiles.concat(this.deletedFiles);
                        if (!uploadedFiles.length) { uploadedFiles = undefined; }
                        resolve(uploadedFiles);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
    });
})();
