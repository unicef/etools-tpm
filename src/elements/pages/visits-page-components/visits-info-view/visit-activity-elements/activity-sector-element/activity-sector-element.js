'use strict';

Polymer({
    is: 'activity-sector-element',

    properties: {
        headings: {
            type: Array,
            value: [{
                'size': 100,
                'label': 'Sector Covered',
                'path': 'sector.name'
            }]
        },
        sectorsColumns: {
            type: Array,
            value: [{
                'size': 100,
                'label': 'PP/SSFA Output'
            }]
        },
        emptyObject: {
            type: Object,
            value: function() {
                return {};
            }
        }
    },

    addNewOutput: function() {
        this.newItem = {};
        this.fire('add-output', {item: this.newItem, id: this.activityId});
    },

    getSectorData: function() {
        if (this.sector._delete) { return _.pick(this.sector, ['_delete', 'id']); }
        let resultId = this.newItem && this.newItem.output && this.newItem.output.resultId;

        if (resultId) {
            return {
                id: this.sector.id,
                tpm_low_results: [{
                    result: resultId,
                    tpm_locations: []
                }]
            };
        }
        return null;
    }
});
