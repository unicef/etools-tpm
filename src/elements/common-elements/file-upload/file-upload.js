'use strict';

(function() {
    Polymer({
        is: 'file-upload',

        properties: {
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
            fileData: {
                type: Object,
                notify: true,
                value: () => ({})
            },
            errors: {
                type: Object,
                value: {},
            },
            files: {
                type: Object,
                value: () => []
            },
            parentId: Number
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
            if (!errors || !this.fileData) { return; }

            let errorMessage = this.get(`errors.file`);
            this.set(`errors.file`, errorMessage);
        },

        validate: function() {
            if (this.required && (!this.fileData || !this.fileData.file)) {
                this.set('errors.file', 'File is not selected');
                return false;
            }

            let alreadySelected = this._fileAlreadySelected();
            if (alreadySelected) { return false; }

            this.set('errors.file', null);
            return true;
        },

        _fileAlreadySelected: function() {
            if (!this.files || !this.files.length) { return false; }

            let alreadySelectedIndex = this.files.findIndex((file) => {
                return file.filename === this.fileData.file_name && file.object_id === this.parentId;
            });

            if (alreadySelectedIndex !== -1) {
                this.set('errors.file', 'File was already uploaded');
                return true;
            } else {
                this.set('errors.file', '');
                return false;
            }
        },

        _hideUploadButton: function(readonly, fileData) {
            return readonly || fileData.file_name;
        },

        _openFileChooser: function() {
            let elem = this.querySelector('#fileInput');

            if (elem && document.createEvent) {
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('click', true, false);
                elem.dispatchEvent(evt);
                this.set('errors.file', null);
            }
        },

        _fileSelected: function(e) {
            if (!e || !e.target) { return; }

            let files = e.target.files || {};
            let file = files[0];
            if (!(file instanceof File)) { return; }

            let newFile = {
                file,
                file_name: file.name
            };

            this.set('fileData', newFile);

            e.target.value = '';
        }

    });
})();
