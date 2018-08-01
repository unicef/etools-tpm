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
                'size': 18,
                'label': 'Reference Number #',
                'name': 'reference_number',
                'link': '*ap_link*',
                'ordered': 'desc',
                'path': 'reference_number',
                'target': '_blank',
                'class': 'with-icon',
                'orderBy': 'id'
            }, {
                'size': 7,
                'label': 'Related Task',
                'path': 'related_task',
                'name': 'related_task'
            }, {
                'size': 25,
                'label': 'Description',
                'labelPath': 'description',
                'name': 'description',
                'property': 'description',
                'custom': true,
                'doNotHide': false,
                'class': 'overflow-visible'
            }, {
                'size': 20,
                'label': 'Assignee (Section / Office)',
                'htmlLabel': 'Assignee<br/>(Section / Office)',
                'path': 'computed_field',
                'html': true,
                'class': 'no-order'
            }, {
                'size': 10,
                'label': 'Status',
                'labelPath': 'status',
                'align': 'center',
                'path': 'status',
                'class': 'caps',
                'name': 'ap_status'
            }, {
                'size': 10,
                'label': 'Due Date',
                'labelPath': 'due_date',
                'path': 'due_date',
                'name': 'date',
                'align': 'center'
            }, {
                'size': 10,
                'label': 'Priority',
                'labelPath': 'high_priority',
                'path': 'priority',
                'align': 'center',
                'name': 'high_priority'
            }]
        },
        actionPoints: {
            type: Array,
            value: () => []
        },
        orderBy: {
            type: String,
            value: '-reference_number'
        },
        modelFields: {
            type: Array,
            value: () => ['assigned_to', 'category', 'description', 'section', 'office', 'due_date', 'high_priority',
                'tpm_activity', 'location', 'cp_output', 'intervention']
        },
        dialogTexts: {
            type: Object,
            value: () => ({
                add: {
                    title: 'Add Action Point',
                    button: 'Save'
                },
                edit: {
                    title: 'Edit Action Point',
                    button: 'Save'
                },
                view: {
                    title: 'View Action Point'
                },
                copy: {
                    title: 'Duplicate Action Point',
                    button: 'Save'
                }
            })
        },
        notTouched: {
            type: Boolean,
            value: false,
            computed: '_checkNotTouched(popupType, editedItem.*)'
        },
        typesForInput: {
            type: Array,
            value: () => ['add', 'copy']
        }
    },

    observers: [
        'resetValidationErrors(dialogOpened)',
        '_errorHandler(errorObject)',
        'updateStyles(basePermissionPath, requestInProcess, editedItem.*)',
        'setPermissionPath(baseVisitPath)',
        '_addComputedField(actionPoints.*, tpmActivities)',
        '_orderChanged(orderBy, columns, actionPoints.*)',
        '_activitySelected(editedItem.tpm_activity, dialogOpened)',
        '_interventionsListChanged(fullPartner.interventions)'
    ],

    listeners: {
        'dialog-confirmed': '_startRequest',
        'ap-request-completed': '_requestCompleted'
    },

    ready: function() {
        this.usersList = (this.getData('unicefUsers') || []).map((user) => {
            let {first_name: firstName, last_name: lastName, id} = user;
            let name = firstName || lastName ? `${user.first_name} ${user.last_name}` : 'Unnamed User';
            return {id, name};
        });
        this.set('offices', this.getData('offices') || []);
        this.set('sections', this.getData('sections') || []);
        this.set('cpOutputs', this.getData('cpOutputs') || []);
        this.set('locations', this.getData('locations') || []);
        this.set('partners', this.getData('partnerOrganisations') || []);

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

    _addComputedField: function() {
        this.itemsToDisplay = this.actionPoints.map((item) => {
            item.priority = item.high_priority && 'High' || ' ';
            let assignedTo = _.get(item, 'assigned_to.name', '--'),
                section = _.get(item, 'section.name', '--'),
                office = _.get(item, 'office.name', '--');
            item.computed_field = `<b>${assignedTo}</b> <br>(${section} / ${office})`;

            let relatedTask = _.findIndex(this.tpmActivities, (activity) => item.tpm_activity === activity.id);
            if (~relatedTask) {
                item.related_task = `000${relatedTask + 1}`.slice(-4);
            }
            return item;
        });
    },

    _orderChanged: function(newOrder, columns) {
        if (!newOrder || !(columns instanceof Array)) { return false; }

        let direction = 'asc';
        let name = newOrder;
        let orderBy;

        if (name.startsWith('-')) {
            direction = 'desc';
            name = name.slice(1);
        }

        columns.forEach((column, index) => {
            if (column.name === name) {
                this.set(`columns.${index}.ordered`, direction);
                orderBy = column.orderBy || name;
            } else {
                this.set(`columns.${index}.ordered`, false);
            }
        });

        let sorted = _.sortBy(this.actionPoints, (item) => item[orderBy]);
        this.itemsToDisplay = direction === 'asc' ? sorted : sorted.reverse();
    },

    _activitySelected: function(activityId, dialogOpened) {
        let activity = _.find(this.tpmActivities, (data) => data.id === activityId);
        if (!activity || !dialogOpened) { return; }

        this.set('editedItem.cp_output', null);
        this.set('editedItem.intervention', null);

        this.selectedPartner = activity.partner.id;
        this.partnerForRequest = this.selectedPartner;

        let cpOutputs = this.getData('cpOutputs'),
            cpOutput = _.get(activity, 'cp_output.id'),
            existsInList = cpOutput && _.find(cpOutputs, (output) => +output.id === +cpOutput);

        if (cpOutput && !existsInList) {
            cpOutputs.push(activity.cp_output);
            this.cpOutputs = _.sortBy(cpOutputs, (output) => output.name);
        } else {
            this.cpOutputs = cpOutputs;
        }

        let originalOutput = _.get(this.originalEditedObj, 'cp_output.id');
        let originalExistsInList = originalOutput && _.find(cpOutputs, (output) => +output.id === +originalOutput);

        setTimeout(() => {
            this.set('editedItem.cp_output', originalExistsInList || existsInList || null);
        }, 100);

    },

    _interventionsListChanged: function(interventions) {
        let originalIntervention = _.get(this.originalEditedObj, 'intervention.id'),
            existsInList = originalIntervention && _.find(interventions, (intervention) => +intervention.id === +originalIntervention);
        // this.set('editedItem.intervention', existsInList || null);
        setTimeout(() => {
            this.set('editedItem.intervention', existsInList || null);
        }, 100);
    },

    _requestAPOptions: function(event) {
        let index = this._getIndex(event);

        if ((!index && index !== 0) || !~index) {
            throw 'Can not find data';
        }

        let itemForEdit = _.get(this, `actionPoints.${index}`);
        this.fire('global-loading', {type: 'get-ap-options', active: true, message: 'Loading data...'});

        let url = this.getEndpoint('visitDetails', {id: this.visitId}).url;
        this.apOptionUrl = `${url}action-points/${itemForEdit.id}/`;
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

    _openCopyDialog: function() {
        let index = this._getIndex(event),
            data = _.omit(this.actionPoints[index], ['id']);

        this._openPopup({
            popupType: 'copy',
            itemForEdit: data
        });
    },

    _openPopup: function(data = {}) {
        let {itemForEdit, popupType = 'add', permissionBase = this.basePermissionPath} = data;

        this.editedApBase = '';
        this.editedApBase = permissionBase;
        if (itemForEdit) {
            this.popupType = popupType;
            this.editedItem = _.cloneDeep(itemForEdit);
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

    _getIndex: function(event) {
        let item = event && event.model && event.model.item,
            index = this.actionPoints && this.actionPoints.indexOf(item);

        if ((!index && index !== 0) || index < 0) { throw Error('Can not find user data'); }

        return index;
    },

    _checkNotTouched: function(popupType) {
        if (popupType !== 'copy' || _.isEmpty(this.originalEditedObj)) { return false; }
        return _.every(this.originalEditedObj, (value, key) => {
            let isObject = _.isObject(value);
            if (isObject) {
                return !value.id || +value.id === +_.get(this, `editedItem.${key}.id`);
            } else {
                return value === this.editedItem[key];
            }
        });
    },

    checkDialogType: function(types) {
        return this.dialogOpened && (types === this.popupType || ~types.indexOf(this.popupType));
    },

    canNotAddAP: function(basePath) {
        if (!basePath) { return true; }

        let readOnly = this.isReadonly(`${basePath}.POST`);
        if (readOnly === null) { readOnly = true; }

        return readOnly;
    },

    canBeEdited: function(status) {
        return status !== 'completed';
    },

    _startRequest: function() {
        if (!this.validate() || this.notTouched) { return; }
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
        if (this.popupType === 'copy') { this.originalEditedObj = {}; }
        if (this.editedItem.due_date === '') { this.editedItem.due_date = null; }

        let data = _.pickBy(this.editedItem, (value, fieldName) => {
            if (!~this.modelFields.indexOf(fieldName)) { return false; }
            let isObject = _.isObject(value) && !_.isArray(value);
            if (isObject) {
                let original = _.get(this, `originalEditedObj.${fieldName}.id`, 0);
                return +value.id !== +original;
            } else {
                return !_.isEqual(value, this.originalEditedObj[fieldName]);
            }
        });

        _.each(['assigned_to', 'office', 'section', 'location', 'intervention', 'cp_output'], (field) => {
            if (data[field]) { data[field] = data[field].id; }
        });
        if (this.editedItem.id && !_.isEmpty(data)) { data.id = this.editedItem.id; }

        return _.isEmpty(data) ? null : data;
    },

    _requestCompleted: function(event, detail) {
        this.requestInProcess = false;
        if (detail && detail.success) {
            this.dialogOpened = false;
        }
    },

    _truncate: function(text) {
        if (!text) { return ''; }
        return `${text}`.slice(0, 90) + (text.length > 90 ? '...' : '');
    }

});
