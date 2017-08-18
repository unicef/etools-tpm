'use strict';

Polymer({
    is: 'visit-activity-tab',

    behaviors: [
        TPMBehaviors.DateBehavior,
        TPMBehaviors.StaticDataController,
        TPMBehaviors.TableElementsBehavior,
        TPMBehaviors.CommonMethodsBehavior
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
        partnership: {
            type: Object,
            value: function() {
                return {};
            }
        },
        itemModel: {
            type: Object,
            value: function() {
                return {
                    implementing_partner: null,
                    partnership: null,
                    cp_output: null,
                    date: '',
                    locations: [],
                };
            }
        },
        partnerRequestInProcess: {
            type: Boolean,
            value: false,
        },
        partnershipRequestInProcess: {
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
                'size': 25,
                'label': 'Implementing Partner',
                'path': 'implementing_partner'
            }, {
                'size': 30,
                'label': 'Partnership',
                'path': 'partnership'
            }, {
                'size': 30,
                'label': 'CP Output',
                'path': 'cp_output'
            }, {
                'size': 15,
                'name': 'date',
                'label': 'Date',
                'path': 'date'
            }]
        },
        details: {
            type: Array,
            value: function() {
                return [{
                    'size': 100,
                    'label': 'Locations',
                    'path': 'locations'
                }, {
                    'size': 100,
                    'label': 'Link to eTools Programme Documents',
                    'path': 'tpm_activities.partnership.attachments'
                }];
            }
        },
        addDialogTexts: {
            type: Object,
            value: function() {
                return {
                    title: 'Add Visit Activity'
                };
            }
        },
        editDialogTexts: {
            type: Object,
            value: function() {
                return {
                    title: 'Edit Visit Activity'
                };
            }
        },
        deleteTitle: {
            type: String,
            value: 'Are you sure that you want to delete this visit activity?'
        },
    },

    listeners: {
        'dialog-confirmed': '_addItemFromDialog',
        'delete-confirmed': 'removeItem',
        'partner-loaded': '_partnerLoaded',
        'partnership-loaded': '_partnershipLoaded',
        'cp-outputs-loaded': '_cpOutputsLoaded',
    },

    observers: [
        '_setSomeRequestInProcess(requestInProcess, partnerRequestInProcess, partnershipRequestInProcess, cpRequestInProcess)',
        '_requestPartner(editedItem.implementing_partner)',
        '_requestPartnership(editedItem.partnership)',
        'resetDialog(dialogOpened)',
        '_errorHandler(errorObject.tpm_activities)',
        'updateStyles(basePermissionPath, someRequestInProcess)',
    ],

    ready: function() {
        this.partners = this.getData('partnerOrganisations') || [];
    },

    _setSomeRequestInProcess: function(requestInProcess, partnerRequestInProcess, partnershipRequestInProcess, cpRequestInProcess) {
        this.someRequestInProcess = requestInProcess || partnerRequestInProcess || partnershipRequestInProcess || cpRequestInProcess;
    },

    _getActivitiesLength: function(dataItemsLength) {
        return dataItemsLength || 0;
    },

    _isReadOnly: function(partnerId, partnershipId, someRequestInProcess) {
        let partnerDefined = partnerId || partnerId === 0;
        let partnershipDefined = partnershipId || partnershipId === 0;
        return !partnerDefined || !partnershipDefined || someRequestInProcess;
    },

    _requestPartner: function(partnerId) {
        if (this.partnerRequestInProcess) { return; }

        this.set('editedItem.partnership', null);
        this.set('partner.interventions', []);

        this.set('editedItem.locations', []);
        this.set('locations', []);

        this.set('editedItem.cp_output', null);
        this.set('cpOutputs', []);

        if (!partnerId && partnerId !== 0) { return; }

        this.partnerRequestInProcess = true;
        this.editedItem.implementing_partner = partnerId;
        this.partnerId = partnerId;
        return true;
    },

    _partnerLoaded: function() {
        this.partnerRequestInProcess = false;
    },

    _requestPartnership: function(partnershipId) {
        if (this.partnershipRequestInProcess) { return; }

        this.set('editedItem.locations', []);
        this.set('locations', []);

        this.set('editedItem.cp_output', null);
        this.set('cpOutputs', []);

        if (!partnershipId && partnershipId !== 0) { return; }

        this.partnershipRequestInProcess = true;
        this.editedItem.partnership = partnershipId;
        this.partnershipId = partnershipId;
        return true;
    },

    _partnershipLoaded: function() {
        this.partnershipRequestInProcess = false;
        this._updateLocations();
        this._updateCpOutputs();
    },

    _updateLocations: function() {
        let sectors = this.get('partnership.sector_locations');
        if (!(sectors instanceof Array)) { return; }

        let locations = [];
        sectors.forEach((sector) => {
            if (sector && (sector.locations instanceof Array)) {
                locations = locations.concat(sector.locations);
            }
        });
        locations = _.sortBy(locations, ['name']);

        this.set('locations', locations);
    },

    _updateCpOutputs: function() {
        let resultLinks = this.get('partnership.result_links');
        if (!(resultLinks instanceof Array)) { return; }

        let cpIds = [];
        resultLinks.forEach((link) => {
            if (link && (link.cp_output || link.cp_output === 0)) {
                cpIds.push(link.cp_output);
            }
        });

        if (cpIds.length) {
            this._requestCpOutputs(cpIds);
        }
    },

    _requestCpOutputs: function(cpIds) {
        if (this.cpRequestInProcess) { return; }

        this.cpRequestInProcess = true;
        this.cpIds = cpIds;
        return true;
    },

    _cpOutputsLoaded: function() {
        this.cpRequestInProcess = false;
    },

    getActivitiesData: function() {
        // //add new partnership check
        // if (this.newItem && this.newItem.partnerOrganisation && this.newItem.intervention) {
        //     let id = this.newItem.intervention.id;
        //     return [{
        //         partnership: id,
        //         tpm_sectors: []
        //     }];
        // }
        // //get partnerships data
        // let partnerships = Polymer.dom(this.root).querySelectorAll('activity-partnership-element'),
        //     data = [];
        //
        // _.each(partnerships, (partnership) => {
        //     let partnershipData = partnership.getPartnershipData();
        //     if (partnershipData) { data.push(partnershipData); }
        // });
        //
        // return data.length ? data : null;
    },
});
