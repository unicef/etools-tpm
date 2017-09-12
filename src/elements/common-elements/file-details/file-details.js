'use strict';

(function() {
    Polymer({
        is: 'file-details',

        behaviors: [
            TPMBehaviors.DateBehavior,
        ],

        properties: {
            allowDelete: {
                type: Boolean,
                value: false,
            },
            data: {
                type: Object,
                value: {},
            },
            filesPath: {
                type: String,
                value: '',
            },
            files: {
                type: Array,
                value: [],
            },
            fileTypes: {
                type: Array,
                value: [],
            },
        },

        observers: [
            '_setFiles(data, filesPath)',
            '_filesChange(files.*, fileTypes.*)',
        ],

        _setFiles: function(data, filesPath) {
            if (data && data[filesPath] && data[filesPath].length) {
                this.set('files', data[filesPath]);
            } else {
                this.set('files', [{}]);
            }
        },

        _filesChange: function() {
            if (!Array.isArray(this.files)) { return; }

            this.files.forEach((file) => {
                if (file.file && file.id && !file.file_name) {
                    file.file_name = this._getFilenameFromUrl(file.file);
                }

                if (file.file_type !== undefined && !file.display_name) {
                    let type = this._getFileType(file.file_type) || {};
                    file.type = type.display_name;
                }
            });
        },

        _getFilenameFromUrl: function(url) {
            if (typeof url !== 'string' || url === '') {
                return;
            }

            return url.split('/').pop();
        },

        _getFileType: function(fileType) {
            if (Array.isArray(this.fileTypes)) {
                let type = this.fileTypes.find(function(type) {
                    return parseInt(type.value, 10) === parseInt(fileType, 10);
                });
                return type || null;
            }
            return null;
        },

        showDeleteBtn: function(item, allowDelete) {
            return item && item.file_name && allowDelete;
        },

        getValue: function(value) {
            return value || '--';
        },

        getDate: function(item) {
            return this.prettyDate(item && item.created) || '--';
        },

        fireDeleteEvent: function(event) {
            let item = event && event.model && event.model.item;
            if (item && item.id !== undefined && this.parentId !== undefined) {
                this.fire('delete-assigned-file', {
                    parentId: this.parentId,
                    fileId: item.id,
                    hyperlink: item.file,
                });
            }
        },
    });
})();
