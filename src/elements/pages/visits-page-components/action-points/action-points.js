'use strict';

Polymer({
    is: 'action-points',

    behaviors: [
        TPMBehaviors.DateBehavior,
        TPMBehaviors.StaticDataController,
        TPMBehaviors.TableElementsBehavior,
        TPMBehaviors.CommonMethodsBehavior,
        TPMBehaviors.TextareaMaxRowsBehavior,
    ],

    properties: {
        basePermissionPath: {
            type: String
        },
        mainProperty: {
            type: String,
            value: 'action_points'
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
                    'size': 25,
                    'label': 'Description',
                    'path': 'description'
                }, {
                    'size': 25,
                    'label': 'Person Responsible',
                    'path': 'person_responsible.name'
                }, {
                    'size': 25,
                    'label': 'Assigned By',
                    'path': 'author.name'
                }, {
                    'size': 25,
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
        addDialogTexts: {
            type: Object,
            value: function() {
                return {
                    title: 'Add Action Point'
                };
            }
        },
        editDialogTexts: {
            type: Object,
            value: function() {
                return {
                    title: 'Edit Action Point'
                };
            }
        },
        dialogTitle: {
            type: String,
            value: 'Are you sure that you want to delete this Action Point?'
        },
    },
    observers: [
        'resetDialog(dialogOpened)',
        '_errorHandler(errorObject)',
        'updateStyles(basePermissionPath, requestInProcess, editedItem.*)',
    ],
    listeners: {
        'dialog-confirmed': '_addItemFromDialog',
        'delete-confirmed': 'removeItem',
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
    },
    getCurrentData: function() {
        if (!this.dialogOpened) { return null; }
        let originalEditedObj = this.addDialog ? {} : this.originalEditedObj;
        let currentData = _.cloneDeep(this.editedItem);
        if (originalEditedObj) {
            currentData = _.pickBy(currentData, (value, key) => {
                let original = originalEditedObj[key];
                return !_.isEqual(original, value) || _.isEqual(key, 'id');
            });
        }
        if (currentData.person_responsible && currentData.person_responsible.id) {
            currentData.person_responsible = currentData.person_responsible.id;
        }
        return [currentData];
    },
});
