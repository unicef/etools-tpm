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
                    'label': 'Vendor Name',
                    'name': 'name',
                    'path': 'tpm_partner.name',
                    'ordered': false
                }, {
                    'size': 30,
                    'label': 'Implementing Partner',
                    'name': 'partner.name',
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
                        'size': 20,
                        'label': 'Location',
                        'name': 'location'
                    }, {
                        'size': 20,
                        'label': 'UNICEF Focal Point',
                        'name': 'focal_point'
                    }];
                }
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

        _showAddButton: function() {
            return this.actionAllowed('new_visit', 'create');
        },

        _setExportLink: function() {
            return this.getEndpoint('visitsList').url + '?format=csv&page_size=all';
        },

        openAddVisitPopup: function() {
            let partners = this.getData('tpmPartners');
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
        }

    });
})();
