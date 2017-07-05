'use strict';

(function() {
    Polymer({
        is: 'visit-details-tab',
        behaviors: [
            TPMBehaviors.DateBehavior,
            TPMBehaviors.StaticDataController
        ],
        properties: {
            visit: {
                type: Object,
                value: {
                    start: 'Tue Mar 28 2017 08:42:21 GMT+0300 (+03)',
                    end: 'Tue Mar 31 2017 08:42:21 GMT+0300 (+03)'
                }
            },
            editMode: {
                type: Boolean,
                value: true,
                observer: '_editMoseChanged'
            },
            partners: {
                type: Array,
                value: function() {
                    return [];
                }
            },
            partnershipDisabled: {
                type: Boolean,
                value: true
            }
        },
        ready: function() {
            this.set('partners', this.getData('partnerOrganisations'));
        },
        _editMoseChanged: function() {
            this.updateStyles();
        },
        _partnerFieldChanged: function() {
            if (this.partnershipDisabled) { this.partnershipDisabled = false; }
        }
    });

})();
