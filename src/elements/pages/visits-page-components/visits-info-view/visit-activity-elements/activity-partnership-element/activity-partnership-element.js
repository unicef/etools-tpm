'use strict';

Polymer({
    is: 'activity-partnership-element',

    properties: {
        headings: {
            type: Array,
            value: [{
                'size': 60,
                'label': 'Implementing Partner',
                'path': 'partnership.partner'
            }, {
                'size': 40,
                'label': 'Partnership',
                'path': 'partnership.number'
            }]
        },
        sectorsColumns: {
            type: Array,
            value: [{
                'size': 100,
                'label': 'Sector Covered'
            }]
        },
        emptyObject: {
            type: Object,
            value: function() {
                return {};
            }
        }
    },

    addNewSector: function() {
        this.newItem = {};
        this.fire('add-sector', {item: this.newItem, id: this.activity.id});
    },

    getPartnershipData: function() {
        if (this.activity._delete) { return _.pick(this.activity, ['_delete', 'id']); }
        let sectorId = this.newItem && this.newItem.sector && this.newItem.sector.id;

        if (sectorId) {
            return {
                id: this.activity.id,
                tpm_sectors: [{
                    sector: sectorId,
                    tpm_low_results: []
                }]
            };
        }

        let sectors = this.querySelectorAll('activity-sector-element'),
            data = [];

        _.each(sectors, (sector) => {
            let sectorData = sector.getSectorData();
            if (sectorData) { data.push(sectorData); }
        });

        if (!_.isEmpty(data)) {
            return {
                id: this.activity.id,
                tpm_sectors: data
            };
        } else {
            return null;
        }
    }
});
