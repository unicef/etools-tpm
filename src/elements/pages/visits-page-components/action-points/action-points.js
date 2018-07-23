'use strict';

Polymer({
    is: 'action-points',

    behaviors: [
        etoolsAppConfig.globals,
        TPMBehaviors.DateBehavior,
        TPMBehaviors.StaticDataController,
        TPMBehaviors.CommonMethodsBehavior,
        TPMBehaviors.TextareaMaxRowsBehavior,
        TPMBehaviors.ActivityToDrD
    ],

    properties: {
        basePermissionPath: String,
        visitBase: {
            type: String,
            computed: '_computeVisitBase(visitId)'
        },
        title: String,
        itemModel: {
            type: Object,
            value: () => ({
                assigned_to: undefined,
                due_date: undefined,
                description: '',
                high_priority: false
            })
        },
        emptyObj: {
            type: Object,
            value: () => ({})
        },
        columns: {
            type: Array,
            value: () => [{
                    'size': 10,
                    'label': 'Task No.',
                    'labelPath': 'tpm_activities.id',
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
        details: {
            type: Array,
            value: () => [{}]
        },
        actionPoints: {
            type: Array,
            value: () => []
        },
        noActionPoints: {
            type: Boolean,
            computed: 'checkAPInTasks(dataItems, dataItems.*)'
        },
        dialogTexts: {
            type: Object,
            value: () => ({
                add: {
                    title: 'Add Action Point',
                    button: 'Add'
                },
                edit: {
                    title: 'Edit Action Point',
                    button: 'Save'
                },
                view: {
                    title: 'View Action Point'
                }
            })
        }
    },

    observers: [
        'resetValidationErrors(dialogOpened)',
        '_errorHandler(errorObject)',
        'updateStyles(basePermissionPath, requestInProcess, editedItem.*)',
        'setPermissionPath(baseVisitPath)',
        'updateTable(actionPoints.*)'
    ],

    listeners: {
        'dialog-confirmed': '_startRequest',
        'ap-request-completed': '_requestCompleted',
        'edit-action-point': '_requestAPOptions'
    },

    ready: function() {
        this.usersList = (this.getData('unicefUsers') || []).map((user) => {
            let {first_name: firstName, last_name: lastName, id} = user;
            let name = firstName || lastName ? `${user.first_name} ${user.last_name}` : 'Unnamed User';
            return {id, name};
        });
        this.set('offices', this.getData('offices') || []);
        this.set('sections', this.getData('sections') || []);

        if (!this.collectionExists('edited_ap_options')) {
            this._addToCollection('edited_ap_options', {});
        }
    },

    setPermissionPath: function(basePath) {
        this.basePermissionPath = basePath ? `${basePath}_ap` : '';
    },

    _computeVisitBase: function(id) {
        return id ? `visit_${id}` : '';
    },

    _showTask: function(activityTask) {
        let id = activityTask && activityTask.id;
        return id && this.actionPoints && _.some(this.actionPoints, (ap) => ap.tpm_activity === id);
    },

    updateTable: function() {
        this.$['activity-repeat'].render();
    },

    checkAPInTasks: function(visitActivities) {
        return visitActivities && !_.some(visitActivities, (activity) => !!_.get(activity, 'action_points.length'));
    },

    _requestAPOptions: function(event, details) {
        let itemForEdit = _.get(details, 'taskAP'),
            apId = _.get(itemForEdit, 'actionPoint.id');

        if (!apId) {
            throw new Error('You need action point id to make a request');
        }
        this.fire('global-loading', {type: 'get-ap-options', active: true, message: 'Loading data...'});

        let url = this.getEndpoint('visitDetails', {id: this.visitId}).url;
        this.apOptionUrl = `${url}action-points/${apId}/`;
        this._itemForEdit = itemForEdit;
    },

    _handleOptionResponse: function(event, detail) {
        this.fire('global-loading', {type: 'get-ap-options'});
        this.apOptionUrl = null;

        if (detail && detail.actions) {
            this._updateCollection('edited_ap_options', detail.actions);
        }
        let itemForEdit = this._itemForEdit;
        this._itemForEdit = null;

        let popupType = this.collectionExists('edited_ap_options.PUT') ? 'edit' : 'view';
        this._openPopup({itemForEdit, popupType, permissionBase: 'edited_ap_options'});
    },

    _openPopup: function(data = {}) {
        let {itemForEdit, popupType = 'add', permissionBase = this.basePermissionPath} = data;

        this.editedApBase = '';
        this.editedApBase = permissionBase;
        if (itemForEdit) {
            this.popupType = popupType;
            this.editedItem = _.cloneDeep(itemForEdit.actionPoint);
        } else {
            this.popupType = popupType;
            this.editedItem = _.cloneDeep(this.itemModel);
        }

        this.originalEditedObj = _.cloneDeep(this.editedItem);
        this.dialogTitle = _.get(this, `dialogTexts.${this.popupType}.title`);
        this.confirmBtnText = _.get(this, `dialogTexts.${this.popupType}.button`);
        this.hideConfirmBtn = !_.get(this, `dialogTexts.${this.popupType}.button`);
        this.dialogOpened = true;
    },

    checkDialogType: function(type) {
        return this.dialogOpened && type === this.popupType;
    },

    canNotAddAP: function(basePath) {
        if (!basePath) { return true; }

        let readOnly = this.isReadonly(`${basePath}.POST`);
        if (readOnly === null) { readOnly = true; }

        return readOnly;
    },

    _startRequest: function() {
        if (!this.validate()) { return; }
        this.requestInProcess = true;

        let apData = this.getActionsData();

        if (apData) {
            let method = apData.id ? 'PATCH' : 'POST';
            this.requestData = {method, apData};
        } else {
            this._requestCompleted(null, {success: true});
        }

    },

    validate: function() {
        let elements = Polymer.dom(this.root).querySelectorAll('.validate-input'),
            valid = true;

        Array.prototype.forEach.call(elements, (element) => {
            if (element.required && !element.validate()) {
                element.invalid = 'This field is required';
                element.errorMessage = 'This field is required';
                valid = false;
            }
        });

        return valid;
    },

    getActionsData: function() {
        if (!this.dialogOpened) { return null; }

        if (this.editedItem.due_date === '') { this.editedItem.due_date = null; }

        let data = _.pickBy(this.editedItem, (value, fieldName) => {
            let isObject = _.isObject(value) && !_.isArray(value);
            if (isObject) {
                return value.id !== _.get(this, `originalEditedObj.${fieldName}.id`);
            } else {
                return !_.isEqual(value, this.originalEditedObj[fieldName]);
            }
        });

        _.each(['assigned_to', 'office', 'section'], (field) => {
            if (data[field]) { data[field] = data[field].id; }
        });
        if (this.editedItem.id && !_.isEmpty(data)) { data.id = this.editedItem.id; }

        return _.isEmpty(data) ? null : data;
    },

    _requestCompleted: function(event, detail) {
        if (this.completeAPAfterRequest) {
            this.completeAPAfterRequest = false;
            this.originalEditedObj = _.clone(this.editedItem);
            this.completeAP();
            return;
        }

        this.requestInProcess = false;
        if (detail && detail.success) {
            this.dialogOpened = false;
        }
    },

    completeAP: function() {
        if (!this.validate()) { return; }
        let data = this.getActionsData();

        if (data) {
            this.completeAPAfterRequest = true;
            this._startRequest();
            return;
        }

        this.requestInProcess = true;
        this.requestData = {
            apData: {id: this.editedItem.id},
            complete: true,
            method: 'POST'
        };
    },

});
