'use strict';

Polymer({
    is: 'visit-activity-tab',

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
        }
    },

    listeners: {
        'add-sector': 'addSector',
        'dialog-confirmed': 'addItem'
    },

    observers: ['resetNewItem(sectorDialogOpened)'],

    addSector: function(event, details) {
        if (!details || !details.id || !details.item) { throw 'Details object is not provided or incorrect!'; }

        let activity = this.activities.filter((activity) => { return activity.id === details.id; })[0];
        if (!activity) { throw `Can not find partnership with id ${details.id}`; }

        let options = activity.partnership.sector_locations.map((sectorLocation) => { return sectorLocation.sector; });
        this.set('sectorOptions', options);
        this.set('newItem', details.item);

        this.sectorDialogOpened = true;
    },

    addItem: function() {
        // this.fire('action-activated', {type: save});
    },

    getActivitiesData: function() {
        //add new partnership check

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
    }
});
