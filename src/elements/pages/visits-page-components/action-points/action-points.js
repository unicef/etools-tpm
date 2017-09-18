'use strict';

Polymer({
    is: 'action-points',

    behaviors: [
        TPMBehaviors.DateBehavior,
        TPMBehaviors.StaticDataController,
        TPMBehaviors.TableElementsBehavior,
        TPMBehaviors.CommonMethodsBehavior,
    ],

    properties: {
        basePermissionPath: {
            type: String
        },
        title: {
            type: String
        },
        itemModel: {
            type: Object,
            value: function() {
                return {
                };
            }
        },
        statuses: {
            type: Array
        },
        columns: {
            type: Array,
            value: function() {
                return [{
                    'size': 20,
                    'label': 'Description',
                    'path': 'description'
                }, {
                    'size': 20,
                    'label': 'Person Responsible',
                    'path': 'person_responsible.name'
                }, {
                    'size': 20,
                    'label': 'Assigned By',
                    'path': 'author.name'
                }, {
                    'size': 20,
                    'label': 'Section',
                    'path': 'section'
                }, {
                    'size': 20,
                    'label': 'Status',
                    'property': 'status',
                    'custom': true,
                    'doNotHide': true
                }];
            }
        },
        details: {
            type: Array,
            value: function() {
                return [{
                    'size': 100,
                    'label': 'Comments',
                    'path': 'comments'
                }, {
                    'size': 100,
                    'label': 'Due Date',
                    'path': 'due_date'
                }];
            }
        },
        filters: {
            type: Array,
            value: function() {
                return [];
            }
        },
    },
    observers: [
        'resetDialog(dialogOpened)',
        '_errorHandler(errorObject)',
        'updateStyles(attachmentsBase, requestInProcess, editedItem.*)',
    ],
    listeners: {
        'dialog-confirmed': '_addItemFromDialog',
    },

    ready: function() {
        this.usersList = (this.getData('unicefUsers') || []).map((user) => {
            return {
                id: user.id,
                name: `${user.first_name} ${user.last_name}`
            };
        });
    },
    getStatusDisplayName: function(value) {
        let status = _.find(this.statuses, ['value', value]);
        return status ? status.display_name : '–';
    }
});
