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
                    partnerId: null,
                    partnershipId: null,
                    cpOutput: '',
                    from_date: '',
                    selectedLocations: [],
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
        someRequestInProcess: {
            type: Boolean,
            value: false,
        },
        columns: {
            type: Array,
            value: [{
                'size': 25,
                'label': 'Implementing Partner',
                'path': 'tpm_activities.partnership.partner'
            }, {
                'size': 30,
                'label': 'Partnership',
                'path': 'tpm_activities.partnership.title'
            }, {
                'size': 30,
                'label': 'CP Output',
                'path': 'tpm_activities.cp_output.name'
            }, {
                'size': 15,
                'name': 'date',
                'label': 'Date',
                'path': 'tpm_activities.cp_output.from_date'
            }]
        },
        details: {
            type: Array,
            value: function() {
                return [{
                    'size': 100,
                    'label': 'Locations',
                    'path': 'tpm_activities.locations'
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
    },

    observers: [
        '_setSomeRequestInProcess(requestInProcess, partnerRequestInProcess, partnershipRequestInProcess)',
        '_requestPartner(editedItem.partnerId)',
        '_requestPartnership(editedItem.partnershipId)',
        'resetDialog(dialogOpened)',
        '_errorHandler(errorObject.tpm_activities)',
        'updateStyles(basePermissionPath, someRequestInProcess)',
    ],

    ready: function() {
        this.partners = this.getData('partnerOrganisations') || [];
        // this.outputsList = this.getData('ppSsfaOutputs');
    },

    _setSomeRequestInProcess: function(requestInProcess, partnerRequestInProcess, partnershipRequestInProcess) {
        this.someRequestInProcess = requestInProcess || partnerRequestInProcess || partnershipRequestInProcess;
    },

    _getActivitiesLength: function(dataItemsLength) {
        return dataItemsLength || 0;
    },

    _isReadOnly: function(partnerId, partnershipId, someRequestInProcess) {
        let partnerDefined = partnerId || partnerId === 0;
        let partnershipDefined = partnershipId || partnershipId === 0;
        // console.log(partnerId, partnershipId);
        return !partnerDefined || !partnershipDefined || someRequestInProcess;
    },

    _requestPartner: function(partnerId) {
        if (this.partnerRequestInProcess) { return; }

        this.set('editedItem.partnershipId', null);
        this.set('partner.interventions', []);
        //TODO: reset locs\outputs, add spinners

        if (!partnerId && partnerId !== 0) { return; }

        this.partnerRequestInProcess = true;
        this.editedItem.partnerId = partnerId;
        this.partnerId = partnerId;
        return true;
    },

    _partnerLoaded: function() {
        // console.log(this.partner);
        this.partnerRequestInProcess = false;
    },

    _requestPartnership: function(partnershipId) {
        if (this.partnershipRequestInProcess) { return; }

        //TODO: reset locs\outputs

        if (!partnershipId && partnershipId !== 0) { return; }

        this.partnershipRequestInProcess = true;
        this.editedItem.partnershipId = partnershipId;
        this.partnershipId = partnershipId;
        return true;
    },

    _partnershipLoaded: function() {
        // console.log(this.partner);
        this.partnershipRequestInProcess = false;
    },

    // addSector: function(event, details) {
    //     if (!details || !details.id || !details.item) { throw 'Details object is not provided or incorrect!'; }
    //
    //     let activity = this.dataItems.filter((activity) => { return activity.id === details.id; })[0];
    //     if (!activity) { throw `Can not find activity with id ${details.id}`; }
    //
    //     let options = activity.partnership.sector_locations.map((sectorLocation) => { return sectorLocation.sector; });
    //     this.set('sectorOptions', options);
    //     this.set('newItem', details.item);
    //
    //     this.sectorDialogOpened = true;
    // },
    //
    // addOutput: function(event, details) {
    //     if (!details || !details.id || !details.item) { throw 'Details object is not provided or incorrect!'; }
    //
    //     let activity = this.dataItems.filter((activity) => { return activity.id === details.id; })[0];
    //     if (!activity) { throw `Can not find activity with id ${details.id}`; }
    //
    //     let resultLinks = {};
    //     _.each(activity.partnership.resultLinks, (result) => {
    //         resultLinks[result.cp_output] = result.id;
    //     });
    //     let options = this.outputsList.filter((output) => {
    //         let exists = resultLinks[output.id];
    //         if (exists) { output.resultId = exists; }
    //         return exists;
    //     });
    //     this.set('outputOptions', options);
    //     this.set('newItem', details.item);
    //
    //     this.outputDialogOpened = true;
    // },
    //
    // addActivity: function() {
    //     this.set('newItem', {});
    //     this.activityDialogOpened = true;
    // },
    //
    // addItem: function() {
    //     this.requestInProcess = true;
    //     this.fire('action-activated', {type: 'save', quietUpdate: true});
    // },
    //
    // getActivitiesData: function() {
    //     //add new partnership check
    //     if (this.newItem && this.newItem.partnerOrganisation && this.newItem.intervention) {
    //         let id = this.newItem.intervention.id;
    //         return [{
    //             partnership: id,
    //             tpm_sectors: []
    //         }];
    //     }
    //     //get partnerships data
    //     let partnerships = Polymer.dom(this.root).querySelectorAll('activity-partnership-element'),
    //         data = [];
    //
    //     _.each(partnerships, (partnership) => {
    //         let partnershipData = partnership.getPartnershipData();
    //         if (partnershipData) { data.push(partnershipData); }
    //     });
    //
    //     return data.length ? data : null;
    // },

    // visitUpdated: function(success) {
    //     this.requestInProcess = false;
    //     if (success) {
    //         this.activityDialogOpened = false;
    //         this.sectorDialogOpened = false;
    //         this.outputDialogOpened = false;
    //     }
    // }
});
