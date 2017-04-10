'use strict';

Polymer({
    is: 'partner-info-view-main',
    behaviors: [TPMBehaviors.PermissionController],
    properties: {
        partner: {
            type: Object,
            notify: true
        },
        partnerSaved: {
            type: Boolean,
            value: false
        },
        partnerSavingError: {
            type: Boolean,
            value: false
        },
    },
    listeners: {'save-partner': '_savePartner'},
    _allowEdit: function() {
        return this.checkPermission('editPartnerDetails');
    },
    _allowDownload: function() {
        return !this.checkPermission('editPartnerDetails') && this.checkPermission('downloadPartnerAttachments');
    },
    _savePartner: function() {
        // TODO Save partner
        if (this.messageTimeout) { clearTimeout(this.messageTimeout); }
        setTimeout(() => {
            this.partnerSaved = true;
        }, 1000);

        this.messageTimeout = setTimeout(() => {
            this.partnerSaved = false;
            this.partnerSavingError = false;
        }, 8000);
    }
});
