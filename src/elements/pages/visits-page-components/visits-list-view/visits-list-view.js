'use strict';

(function() {
    Polymer({
        is: 'visits-list-view',

        behaviors: [
            etoolsAppConfig.globals,
            TPMBehaviors.PermissionController,
            TPMBehaviors.StaticDataController,
            TPMBehaviors.CommonMethodsBehavior,
            TPMBehaviors.LastCreatedController
        ],

        properties: {
            basePermissionPath: {
                type: String,
                value: ''
            },
            queryParams: {
                type: Object,
                notify: true
            },
            listHeadings: {
                type: Array,
                value: [{
                    'size': 20,
                    'label': 'Reference #',
                    'name': 'reference_number',
                    'link': 'visits/*data_id*/details',
                    'ordered': false
                }, {
                    'size': 30,
                    'label': 'TPM Name',
                    'name': 'name',
                    'path': 'tpm_partner.name',
                    'ordered': false
                }, {
                    'size': 30,
                    'label': 'Implementing Partners',
                    'name': 'implementing_partners',
                    'ordered': false
                }, {
                    'size': 20,
                    'label': 'Status',
                    'name': 'status',
                    'ordered': false
                }]
            },
            listDetails: {
                type: Array,
                value: function() {
                    return [{
                        'size': 100,
                        'label': 'Locations',
                        'name': 'locations'
                    }, {
                        'size': 100,
                        'label': 'UNICEF Focal Points',
                        'name': 'unicef_focal_points'
                    }];
                }
            },
            filters: {
                type: Array,
                value: [
                    {
                        name: 'Implementing Partner',
                        query: 'query_1', //TODO: query
                        optionValue: 'id',
                        optionLabel: 'name',
                        selection: []
                    },
                    {
                        name: 'Location',
                        query: 'query_2', //TODO: query
                        optionValue: 'id',
                        optionLabel: 'name',
                        selection: []
                    },
                    {
                        name: 'status',
                        query: 'status',
                        hideSearch: true,
                        optionValue: 'value',
                        optionLabel: 'display_name',
                        selection: []
                    },
                    {
                        name: 'Section',
                        query: 'query_3', //TODO: query
                        optionValue: 'id',
                        optionLabel: 'name',
                        selection: []
                    },
                    {
                        name: 'CP Output',
                        query: 'query_4', //TODO: query
                        optionValue: 'id',
                        optionLabel: 'name',
                        selection: []
                    },
                ]
            },
            visitsList: {
                type: Array,
                value: []
            },
        },

        observers: [
            'resetDialog(dialogOpened)'
        ],

        listeners: {
            'add-new-tap': 'openAddVisitPopup',
            'visit-created': 'visitCreated',
            'dialog-confirmed': 'addNewVisit'
        },

        ready: function() {
            this.setupFiltersAndHeadings();
            this.setFiltersSelections();
        },

        setupFiltersAndHeadings: function() {
            //TODO: hide TPM Name for TPM
        },

        _getFilterIndex: function(query) {
            if (!(this.filters instanceof Array)) { return -1; }

            return this.filters.findIndex((filter) => {
                return filter.query === query;
            });
        },

        setFiltersSelections: function() {
            let partnerFilterIndex = this._getFilterIndex('query_1');
            let locationFilterIndex = this._getFilterIndex('query_2');
            let statusFilterIndex = this._getFilterIndex('status');
            let sectionFilterIndex = this._getFilterIndex('query_3');
            let cpFilterIndex = this._getFilterIndex('query_4');

            if (partnerFilterIndex !== -1) {
                this.set(`filters.${partnerFilterIndex}.selection`, this.getData('partnerOrganisations') || []);
            }

            if (locationFilterIndex !== -1) {
                this.set(`filters.${locationFilterIndex}.selection`, this.getData('offices') || []); //TODO:
            }

            if (statusFilterIndex !== -1) {
                this.set(`filters.${statusFilterIndex}.selection`, this.getData('statuses') || []);
            }

            if (sectionFilterIndex !== -1) {
                this.set(`filters.${sectionFilterIndex}.selection`, this.getData('sections') || []); //TODO:
            }

            if (cpFilterIndex !== -1) {
                this.set(`filters.${cpFilterIndex}.selection`, this.getData('ppSsfaOutputs') || []); //TODO:
            }
        },

        _showAddButton: function() {
            return this.actionAllowed('new_visit', 'create');
        },

        _setExportLink: function() {
            return this.getEndpoint('visitsList').url + '?format=csv&page_size=all';
        },

        openAddVisitPopup: function() {
            let partners = this.getData('tpmPartners') || [];
            this.set('partnerOrganisations', partners.filter((partner) => partner.status === 'active'));
            this.dialogOpened = true;
        },

        resetDialog: function(dialogOpened) {
            if (!dialogOpened) {
                this.partnerOrganisation = '';
                let target = this.$.partnerInput;
                this._resetFieldError({target});
            }
        },

        addNewVisit: function() {
            if (!this.$.partnerInput.validate()) { return; }
            this.requestInProcess = true;
            this.newPartnerId = this.partnerOrganisation.id;
        },

        visitCreated: function(event, details) {
            this.requestInProcess = false;
            let {success, data} = details || {};
            if (success && data) {
                this._setLastData(data, `visit_${data.id}`);
                //redirect
                let path = `visits/${data.id}/details`;
                this.set('path', this.getAbsolutePath(path));
                this.dialogOpened = false;
            }
        },
    });
})();
