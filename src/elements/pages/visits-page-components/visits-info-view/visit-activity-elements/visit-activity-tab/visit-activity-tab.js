'use strict';

Polymer({
    is: 'visit-activity-tab',

    behaviors: [
        TPMBehaviors.DateBehavior,
        TPMBehaviors.StaticDataController,
        TPMBehaviors.TableElementsBehavior,
        TPMBehaviors.CommonMethodsBehavior,
        TPMBehaviors.TextareaMaxRowsBehavior,
    ],

    properties: {
        mainProperty: {
            type: String,
            value: 'tpm_activities'
        },
        partner: {
            type: Object,
            value: function() {
                return {};
            }
        },
        intervention: {
            type: Object,
            value: function() {
                return {};
            }
        },
        cpOutputs: {
            type: Array,
            value: function() {
                return [];
            }
        },
        itemModel: {
            type: Object,
            value: function() {
                return {
                    partner: {
                        id: null,
                        name: '',
                    },
                    intervention: {
                        id: null,
                        title: '',
                    },
                    cp_output: {
                        id: null,
                        result_name: '',
                    },
                    date: '',
                    locations: [],
                    section: null,
                    additional_information: '',
                    unicef_focal_points: [],
                    offices: []
                };
            }
        },
        optionsModel: {
            type: Object,
            value: function() {
                return {
                    intervention: null,
                    cp_output: null,
                };
            },
        },
        partnerRequestInProcess: {
            type: Boolean,
            value: false,
        },
        interventionRequestInProcess: {
            type: Boolean,
            value: false,
        },
        cpRequestInProcess: {
            type: Boolean,
            value: false,
        },
        someRequestInProcess: {
            type: Boolean,
            value: false,
        },
        columns: {
            type: Array,
            value: [{
                'size': 10,
                'label': 'ID',
                'labelPath': 'tpm_activities.id',
                'name': 'unique_id'
            },{
                'size': 25,
                'label': 'Implementing Partner',
                'labelPath': 'tpm_activities.partner',
                'path': 'partner.name'
            }, {
                'size': 25,
                'label': 'Partnership',
                'labelPath': 'tpm_activities.intervention',
                'path': 'intervention.title'
            }, {
                'size': 25,
                'label': 'CP Output',
                'labelPath': 'tpm_activities.cp_output',
                'path': 'cp_output.name'
            }, {
                'size': 15,
                'name': 'date',
                'label': 'Date',
                'labelPath': 'tpm_activities.date',
                'path': 'date'
            }]
        },
        details: {
            type: Array,
            value: function() {
                return [{
                    'size': 100,
                    'label': 'Section',
                    'labelPath': 'tpm_activities.section',
                    'path': 'section.name',
                }, {
                    'size': 100,
                    'name': 'styled_array',
                    'property': 'name',
                    'options': {
                        'delimiter': '[',
                        'style': 'font-weight: 500;',
                    },
                    'html': 'true',
                    'label': 'Locations',
                    'labelPath': 'tpm_activities.locations',
                    'path': 'locations',
                }, {
                    'size': 100,
                    'label': 'Additional information',
                    'labelPath': 'tpm_activities.additional_information',
                    'path': 'additional_information',
                }, {
                    'size': 100,
                    'name': 'array',
                    'property': 'name',
                    'delimiter': ' <b>||</b> ',
                    'html': 'true',
                    'label': 'Unicef Focal Points',
                    'labelPath': 'tpm_activities.unicef_focal_points',
                    'path': 'unicef_focal_points',
                },{
                    'size': 100,
                    'name': 'array',
                    'property': 'name',
                    'delimiter': ' <b>||</b> ',
                    'html': 'true',
                    'label': 'Offices',
                    'labelPath': 'tpm_activities.offices',
                    'path': 'offices',
                }];
            }
        },
        specialPartnerTypes: {
            type: Array,
            value: ['Bilateral / Multilateral', 'Government'],
        },
        addDialogTexts: {
            type: Object,
            value: function() {
                return {
                    title: 'Add Visit Task'
                };
            }
        },
        editDialogTexts: {
            type: Object,
            value: function() {
                return {
                    title: 'Edit Visit Task'
                };
            }
        },
        removeDialogTitle: {
            type: String,
            value: 'Are you sure that you want to delete this visit task?'
        },
    },

    listeners: {
        'dialog-confirmed': '_addItemFromDialog',
        'delete-confirmed': 'removeItem',
        'partner-loaded': '_partnerLoaded',
        'intervention-loaded': '_interventionLoaded',
        'cp-outputs-loaded': '_cpOutputsLoaded',
    },

    observers: [
        '_setSomeRequestInProcess(requestInProcess, partnerRequestInProcess, interventionRequestInProcess, cpRequestInProcess)',
        '_requestPartner(editedItem.partner.id)',
        '_requestPartnership(optionsModel.intervention.id)',
        'resetDialog(dialogOpened)',
        '_errorHandler(errorObject.tpm_activities)',
        'updateStyles(basePermissionPath, someRequestInProcess, editedItem.*, optionsModel.*)',
        'notifyDialogResize("activityDialog", editedItem.*, optionsModel.*)',
        '_setPartnershipValue(partner.interventions, editedItem.intervention)',
        '_setCpValue(cpOutputs, editedItem.cp_output)',
    ],

    ready: function() {
        this.partners = this.getData('partnerOrganisations') || [];
        this.sections = this.getData('sections') || [];
        this.officesList = this.getData('offices');
        this.unicefUsersList = (this.getData('unicefUsers') || []).map((user) => {
            return {
                id: user.id,
                name: `${user.first_name} ${user.last_name}`
            };
        });

        this._updateLocations();
        document.addEventListener('locations-loaded', this._updateLocations.bind(this));
    },

    _setSomeRequestInProcess: function(requestInProcess, partnerRequestInProcess, interventionRequestInProcess, cpRequestInProcess) {
        this.someRequestInProcess = requestInProcess || partnerRequestInProcess || interventionRequestInProcess || cpRequestInProcess;
    },

    _getActivitiesLength: function(dataItemsLength) {
        return dataItemsLength || 0;
    },

    _canBeChanged: function(basePermissionPath) {
        let fields = [
            'tpm_activities.partner', 'tpm_activities.intervention',
            'tpm_activities.cp_output', 'tpm_activities.section', 'tpm_activities.date',
            'tpm_activities.locations', 'tpm_activities.additional_information',
            'tpm_activities.offices', 'tpm_activities.unicef_focal_points'
        ];
        //return true if some field can be edited
        return fields.some((field) => {
            return !this.isReadOnly(field, basePermissionPath);
        });
    },

    _isReadOnly: function(field, partner, intervention, someRequestInProcess, basePermissionPath) {
        let fieldReadonly = this.isReadOnly(field, basePermissionPath);
        let partnerDefined = partner && (partner.id || partner.id === 0) || partner === 'true';
        let partnerRequiresIntervention = partner && this.specialPartnerTypes.indexOf(partner.partner_type) !== -1;
        let interventionDefined = intervention && (intervention.id || intervention.id === 0) ||
            intervention === 'true' || partnerRequiresIntervention;
        return fieldReadonly || !partnerDefined || !interventionDefined || someRequestInProcess;
    },

    _showInterventions: function(IPType) {
        return IPType && this.specialPartnerTypes.indexOf(IPType) === -1;
    },

    _updateLocations: function() {
        this.locations = this.getData('locations') || [];
    },

    _setPartnershipValue: function(options, value) {
        if (value && value.id && options && options.length) {
            let optionsContainsPartnership = options.find((option) => {
                return option.id === value.id;
            });
            if (optionsContainsPartnership) {
                this.async(() => {
                    this.set('optionsModel.intervention', value);
                }, 200);
            }
        }
    },

    _setCpValue: function(options, value) {
        if (value && value.id && options && options.length) {
            let optionsContainsCp = options.find((option) => {
                return option.id === +value.id;
            });
            if (optionsContainsCp) {
                this.async(() => {
                    this.set('optionsModel.cp_output', value);
                }, 200);
            }
        }
    },

    _requestPartner: function(partnerId) {
        if (this.partnerRequestInProcess || this.lastPartnerId === partnerId) { return; }
        this.lastPartnerId = partnerId;

        if (!this.editDialogOpened) {
            this.set('intervention', null);
            this.set('optionsModel.intervention', null);
            this.set('partner.interventions', []);

            this.set('optionsModel.cp_output', null);
            this.set('cpOutputs', []);
        }

        if (!partnerId && partnerId !== 0) { return; }

        this.partnerRequestInProcess = true;
        this.partnerId = partnerId;
        return true;
    },

    _partnerLoaded: function(event, details) {
        this.set('errors', {});
        this.partnerRequestInProcess = false;

        if (this.editDialogOpened && !details.success) {
            this.editDialogOpened = false;
        }
    },

    _requestPartnership: function(interventionId) {
        if (this.interventionRequestInProcess || this.lastPartnershipId === interventionId) { return; }
        this.lastPartnershipId = interventionId;

        if (!this.editDialogOpened) {
            this.set('optionsModel.cp_output', null);
            this.set('cpOutputs', []);
        }

        if (!interventionId && interventionId !== 0) { return; }

        this.interventionRequestInProcess = true;
        this.interventionId = interventionId;
        return true;
    },

    _interventionLoaded: function(event, details) {
        this.interventionRequestInProcess = false;
        this._updateCpOutputs();

        if (this.editDialogOpened && !details.success) {
            this.editDialogOpened = false;
        }
    },

    _updateCpOutputs: function() {
        let resultLinks = this.get('intervention.result_links');
        if (!(resultLinks instanceof Array)) { return; }

        let cpIds = [];
        resultLinks.forEach((link) => {
            if (link && (link.cp_output || link.cp_output === 0)) {
                cpIds.push(link.cp_output);
            }
        });

        if (cpIds.length) {
            this._requestCpOutputs(cpIds);
        } else {
            this.editDialogOpened = false;
        }
    },

    _requestCpOutputs: function(cpIds) {
        if (this.cpRequestInProcess) { return; }

        this.cpRequestInProcess = true;
        this.cpIds = cpIds;
        return true;
    },

    _cpOutputsLoaded: function() {
        this.editDialogOpened = false;
        this.cpRequestInProcess = false;
    },

    locationsTooltipText: function(locations) {
        if (!(locations instanceof Array)) { return ''; }
        let names = locations
            .map(location => location && location.name)
            .filter(name => name !== undefined);
        return names.join(', ');
    },

    _openDialog: function(index) {
        if (!this.deleteDialog) {
            this.editDialogOpened = true;
            this.editedItem = _.cloneDeep(this.dataItems[index]);
            this.originalEditedObj = _.cloneDeep(this.dataItems[index]);
        } else {
            let id = this.dataItems && this.dataItems[index] && this.dataItems[index].id;
            this.editedItem = {id};
        }

        this.editedIndex = index;
        this.dialogOpened = true;
        this.copyDialog = false;
    },

    openAddActivityDialog: function() {
        this.openAddDialog();
        this.copyDialog = false;
    },

    openCopyDialog: function(e) {
        this.openEditDialog(e);

        this.dialogTitle = 'Copy Item';
        this.confirmBtnText = 'Add';
        this.copyDialog = true;
    },

    _errorHandler: function(errorData) {
        this.requestInProcess = false;
        if (!errorData) { return; }
        let refactoredData = this.dialogOpened ? this.refactorErrorObject(errorData)[0] : this.refactorErrorObject(errorData);

        if (typeof refactoredData === 'string') {
            this.fire('toast', {text: `${this.getLabel('tpm_activities', this.basePermissionPath)}: ${refactoredData}`});
        }

        this.set('errors', refactoredData);
    },

    validate: function() {
        let changesNotEmpty = true;
        let dataChanges;
        let changes;

        if (this.copyDialog) {
            dataChanges = this._getDifference(this.originalEditedObj, this.editedItem);
            changes = _.values(dataChanges);
            changesNotEmpty = changes.some(value => value !== undefined);
        }

        if (!changesNotEmpty) {
            this.fire('toast', {text: 'You must change at least one field'});
            return false;
        }

        if (this.editedItem && this.editedItem._delete) { return true; }
        let elements = Polymer.dom(this.root).querySelectorAll('.validate-input');
        let valid = true;

        Array.prototype.forEach.call(elements, (element) => {
            if (element.required && !element.validate()) {
                element.invalid = 'This field is required';
                element.errorMessage = 'This field is required';
                valid = false;
            }
        });

        // validate PD/SSFA
        let interventionInput = Polymer.dom(this.root).querySelector('#interventionInput');
        let partner = this.get('editedItem.partner');
        let partnerRequiresIntervention = partner && this.specialPartnerTypes.indexOf(partner.partner_type) === -1;
        if (interventionInput && interventionInput.required && partnerRequiresIntervention && !interventionInput.validate()) {
            interventionInput.invalid = 'This field is required';
            interventionInput.errorMessage = 'This field is required';
            valid = false;
        }

        return valid;
    },

    _getDifference: function(original = {}, edited = {}) {
        let paths = ['partner.id', 'date', 'section.id', 'locations', 'additional_information', '_delete', 'offices', 'unicef_focal_points'];
        let optionsPaths = ['intervention.id', 'cp_output.id'];
        let allPaths = paths.concat(optionsPaths);

        let originalData = _.pick(original, allPaths);
        let currentData = _.pick(edited, paths);
        let optionsData = {};
        let changedData = {};

        optionsPaths.forEach((path) => {
            _.set(optionsData, path, _.get(this.optionsModel, path) || null);
        });
        _.assign(currentData, optionsData);

        allPaths.forEach((path) => {
            let originalValue = _.get(originalData, path);
            let currentValue = _.get(currentData, path);

            if (path === 'cp_output.id') {
                originalValue = +originalValue;
            }

            if (originalValue !== currentValue) {
                _.set(changedData, path, currentValue);
            }
        });

        let implementingPartner = _.get(changedData, 'partner.id') || undefined;
        let intervention = _.get(changedData, 'intervention.id') || undefined;
        let cpOutput = _.get(changedData, 'cp_output.id') || undefined;
        let section = _.get(changedData, 'section.id');
        let additionalInformation = _.get(changedData, 'additional_information');
        let date = _.get(changedData, 'date') || undefined;
        let _delete = _.get(changedData, '_delete');

        let locations = this._processArraysData(original, currentData, 'locations');
        let unicefFocalPoints = this._processArraysData(original, currentData, 'unicef_focal_points');
        let offices = this._processArraysData(original, currentData, 'offices');

        return {
            partner: implementingPartner,
            intervention,
            cp_output: cpOutput,
            section,
            additional_information: additionalInformation,
            date, locations, _delete, offices,
            unicef_focal_points: unicefFocalPoints
        };
    },

    _processArraysData: function(original, current, field) {
        let data = _.isEqual(original[field], current[field]) ? [] : (current[field] || []);
        data = data.map((item) => item && item.id);
        return data.length ? data : undefined;
    },

    getActivitiesData: function() {
        if (!this.dialogOpened) { return null; }
        let data;

        if (this.addDialog || this.copyDialog) {
            data = this._getDifference({}, this.editedItem);
        } else {
            data = this._getDifference(this.originalEditedObj, this.editedItem);
        }

        let dataValues = _.values(data);
        let dataNotEmpty = dataValues.some(value => value !== undefined);

        if (!this.addDialog && !this.copyDialog) {
            data.id = _.get(this.editedItem, 'id');
        }

        if (dataNotEmpty) {
            return [data];
        }

        return null;
    },
});
