'use strict';

Polymer({
    is: 'partner-status',
    properties: {
        showSaveBtn: {
            type: Boolean,
            value: true
        }
    },

    _showSyncedStatus: function(partner) {
        return partner.vision_synced === true &&
               partner.deleted_flag === false &&
               (typeof partner.blocked === 'undefined' || partner.blocked === false);
    },

    _showBlockedStatus: function(partner) {
        return partner.deleted_flag === false && (typeof partner.blocked !== 'undefined' && partner.blocked === true)
    },

    _showMakedForDeletionStatus: function(partner) {
        return partner.deleted_flag === true
    },

    _showNotSyncedStatus: function(partner) {
        return partner.vision_synced === false;
    },
    _triggerPartnerSave: function() {
        this.fire('save-partner', {});
    }
});