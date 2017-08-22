'use strict';

Polymer({
    is: 'visit-activity-tab',

    behaviors: [TPMBehaviors.StaticDataController],

    properties: {
        columns: {
            type: Array,
            value: [{
                'size': 60,
                'label': 'Implementing Partner'
            }, {
                'size': 40,
                'label': 'Partnership'
            }]
        },
        partnerOrg: {
            type: Object,
            value: function() {
                return {};
            }
        },
        emptyObject: {
            type: Object,
            value: function() {
                return {};
            }
        }
    },

    listeners: {
        'add-sector': 'addSector',
        'dialog-confirmed': 'addItem',
        'partner-loaded': '_partnerLoaded',
        'add-output': 'addOutput'
    },

    observers: ['resetNewItem(sectorDialogOpened, activityDialogOpened, outputDialogOpened)'],

    ready: function() {
        this.partnerOrganisations = this.getData('partnerOrganisations');
        this.outputsList = this.getData('ppSsfaOutputs');
    },

    addSector: function(event, details) {
        if (!details || !details.id || !details.item) { throw 'Details object is not provided or incorrect!'; }

        let activity = this.activities.filter((activity) => { return activity.id === details.id; })[0];
        if (!activity) { throw `Can not find activity with id ${details.id}`; }

        let options = activity.partnership.sector_locations.map((sectorLocation) => { return sectorLocation.sector; });
        this.set('sectorOptions', options);
        this.set('newItem', details.item);

        this.sectorDialogOpened = true;
    },

    addOutput: function(event, details) {
        if (!details || !details.id || !details.item) { throw 'Details object is not provided or incorrect!'; }

        let activity = this.activities.filter((activity) => { return activity.id === details.id; })[0];
        if (!activity) { throw `Can not find activity with id ${details.id}`; }

        let resultLinks = {};
        _.each(activity.partnership.resultLinks, (result) => {
            resultLinks[result.cp_output] = result.id;
        });
        let options = this.outputsList.filter((output) => {
            let exists = resultLinks[output.id];
            if (exists) { output.resultId = exists; }
            return exists;
        });
        this.set('outputOptions', options);
        this.set('newItem', details.item);

        this.outputDialogOpened = true;
    },

    addActivity: function() {
        this.set('newItem', {});
        this.activityDialogOpened = true;
    },

    addItem: function() {
        this.requestInProcess = true;
        this.fire('action-activated', {type: 'save', quietUpdate: true});
    },

    getActivitiesData: function() {
        //add new partnership check
        if (this.newItem && this.newItem.partnerOrganisation && this.newItem.intervention) {
            let id = this.newItem.intervention.id;
            return [{
                partnership: id,
                tpm_sectors: []
            }];
        }
        //get partnerships data
        let partnerships = Polymer.dom(this.root).querySelectorAll('activity-partnership-element'),
            data = [];

        _.each(partnerships, (partnership) => {
            let partnershipData = partnership.getPartnershipData();
            if (partnershipData) { data.push(partnershipData); }
        });

        return data.length ? data : null;
    },

    resetNewItem: function() {
        _.each(this.newItem, (value, key) => {
            delete this.newItem[key];
        });
    },

    _requestPartner: function(event, id) {
        if (this.pOrgRequestInProcess) { return; }

        this.set('newItem.intervention', null);

        let partnerId = (event && event.detail && event.detail.selectedValues && event.detail.selectedValues.id) || id;

        if (!partnerId) { return; }

        this.pOrgRequestInProcess = true;
        this.partnerOrgId = partnerId;
        return true;
    },

    _partnerLoaded: function() {
        this.pOrgRequestInProcess = false;
    },

    visitUpdated: function(success) {
        this.requestInProcess = false;
        if (success) {
            this.activityDialogOpened = false;
            this.sectorDialogOpened = false;
            this.outputDialogOpened = false;
        }
    }
});
