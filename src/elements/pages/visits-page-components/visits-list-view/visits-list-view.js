'use strict';

(function() {
    Polymer({
        is: 'visits-list-view',

        behaviors: [
            etoolsAppConfig.globals,
            TPMBehaviors.PermissionController,
            TPMBehaviors.StaticDataController,
            TPMBehaviors.CommonMethodsBehavior,
            TPMBehaviors.LastCreatedController,
            TPMBehaviors.UserController,
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
                    'labelPath': 'reference_number',
                    'name': 'reference_number',
                    'link': 'visits/*data_id*/details',
                    'ordered': false
                }, {
                    'size': 30,
                    'label': 'TPM Name',
                    'labelPath': 'tpm_partner.name',
                    'name': 'tpm_partner__name',
                    'path': 'tpm_partner.name',
                    'ordered': false
                }, {
                    'size': 30,
                    'name': 'ordered_list',
                    'property': 'name',
                    'label': 'Implementing Partners',
                    'labelPath': 'implementing_partners',
                    'path': 'implementing_partners',
                    'html': 'true',
                    'class': 'no-order',
                    'noOrder': true,
                }, {
                    'size': 20,
                    'label': 'Status',
                    'labelPath': 'status',
                    'name': 'status',
                    'ordered': false
                }]
            },
            listDetails: {
                type: Array,
                value: function() {
                    return [{
                        'size': 100,
                        'name': 'styled_array',
                        'property': 'name',
                        'options': {
                            'delimiter': '[',
                            'style': 'font-weight: 500;',
                        },
                        'html': 'true',
                        'label': 'Locations',
                        'labelPath': 'locations',
                        'path': 'locations',
                    }, {
                        'size': 100,
                        'name': 'array',
                        'property': 'name',
                        'label': 'UNICEF Focal Points',
                        'labelPath': 'unicef_focal_points',
                        'path': 'unicef_focal_points'
                    }, {
                        'size': 100,
                        'name': 'array',
                        'property': 'name',
                        'label': 'Sections',
                        'labelPath': 'sections',
                        'path': 'sections'
                    }];
                }
            },
            filters: {
                type: Array,
                value: [
                    {
                        name: 'TPM Name',
                        query: 'tpm_partner',
                        optionValue: 'id',
                        optionLabel: 'name',
                        selection: []
                    },
                    {
                        name: 'Implementing Partner',
                        query: 'tpm_activities__partner',
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
                        query: 'tpm_activities__section',
                        optionValue: 'id',
                        optionLabel: 'name',
                        selection: []
                    },
                    {
                        name: 'CP Output',
                        query: 'tpm_activities__cp_output',
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

        attached: function() {
            document.addEventListener('visit-filters-updated', this._visitFiltersUpdated.bind(this));
        },

        detached: function() {
            document.removeEventListener('visit-filters-updated', this._visitFiltersUpdated);
        },

        ready: function() {
            this.setupFiltersAndHeadings();
        },

        _visitFiltersUpdated: function() {
            let filtersElement = this.$.filters;
            this.setFiltersSelections();

            if (filtersElement) {
                filtersElement._reloadFilters();
            }
        },

        setupFiltersAndHeadings: function() {
            let isTpmUser;
            try {
                isTpmUser = this.isTpmUser();
            } catch (err) {
                console.log(err);
            }

            if (isTpmUser) {
                //remove TPM Name filter
                let tpmFilterIndex = this._getFilterIndex('tpm_partner');
                this.filters.splice(tpmFilterIndex, 1);

                //remove TPM name column
                let partnerHeadingIndex = this.listHeadings.findIndex((heading) => {
                    return heading.name === 'tpm_partner__name';
                });
                this.listHeadings.splice(partnerHeadingIndex, 1);
                this.listHeadings.forEach((heading) => {
                    heading.size += 10;
                });
            }
        },

        _getFilterIndex: function(query) {
            if (!(this.filters instanceof Array)) { return -1; }

            return this.filters.findIndex((filter) => {
                return filter.query === query;
            });
        },

        setFiltersSelections: function() {
            let queryAndKeyPairs = [
                {query: 'tpm_partner', dataKey: 'tpmPartners'},
                {query: 'tpm_activities__partner', dataKey: 'filterIP'},
                {query: 'status', dataKey: 'statuses'},
                {query: 'tpm_activities__section', dataKey: 'filterSections'},
                {query: 'tpm_activities__cp_output', dataKey: 'filterCpOutputs'},
            ];

            queryAndKeyPairs.forEach((pair) => {
                let filterIndex = this._getFilterIndex(pair.query);
                let data = this.getData(pair.dataKey) || [];
                this.setFilterSelection(filterIndex, data);
            });
        },

        setFilterSelection: function(filterIndex, data) {
            if (filterIndex !== undefined && filterIndex !== -1) {
                this.set(`filters.${filterIndex}.selection`, data);
                return true;
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
            partners = partners.sort((a, b) => a.name > b.name);
            this.set('partnerOrganisations', partners);
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
            let newPartnerId = this.get('partnerOrganisation.id');

            if (newPartnerId || newPartnerId === 0) {
                this.newPartnerId = newPartnerId;
                this.requestInProcess = true;
            } else {
                this.set('errorObject.tpm_partner', 'This field is required');
            }
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
        _getLinks: function() {
            return [{
                name: 'Locations Level',
                url: this.getEndpoint('visitsList').url + 'locations/export/'
            },{
                name: 'Tasks Level',
                url: this.getEndpoint('visitsList').url + 'activities/export/'
            },{
                name: 'Visit Level',
                url: this.getEndpoint('visitsList').url + 'export/'
            },{
                name: 'Action Points',
                url: this.getEndpoint('visitsList').url + 'action-points/export/'
            }];
        }
    });
})();
