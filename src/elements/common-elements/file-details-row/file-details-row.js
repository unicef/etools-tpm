'use strict';

(function() {
    Polymer({
        is: 'file-details-row',

        behaviors: [
            TPMBehaviors.DateBehavior,
            TPMBehaviors.CommonMethodsBehavior,
        ],

        properties: {
            basePermissionPath: {
                type: String
            },
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
            parentId: {
                type: Number,
                observer: 'updateTable'
            },
        },

        getFileType: function(fileType, fileTypes) {
            if (!Array.isArray(fileTypes) || !fileTypes.length) {
                return null;
            }

            let type = fileTypes.find(function(type) {
                return parseInt(type.value, 10) === parseInt(fileType, 10);
            });
            return type && type.display_name || '--';

        },

        showDeleteBtn: function(item, allowDelete) {
            return item && item.filename && allowDelete;
        },

        getValue: function(value) {
            return value || '--';
        },

        getDate: function(item) {
            return this.prettyDate(item && item.created) || '--';
        },

        fireDeleteEvent: function(event) {
            let item = event && event.model && event.model.item;
            if (item && item.id) {
                this.fire('delete-assigned-file', {id: item.id});
            }
        },

        _showAttachment: function(attachment) {
            return attachment.object_id === this.parentId;
        },

        updateTable: function() {
            this.$['attachments-repeat'].render();
        }

    });
})();
