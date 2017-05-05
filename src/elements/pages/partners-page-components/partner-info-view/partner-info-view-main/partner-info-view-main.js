'use strict';

Polymer({
    is: 'partner-info-view-main',
    behaviors: [TPMBehaviors.PermissionController],
    properties: {
        fileTypes: {
            type: Array,
            value: [
                {value: '1', display_name: 'Training materials'},
                {value: '2', display_name: 'ToRs'},
                {value: '3', display_name: 'Other'}
            ]
        },
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
        }
    },
    listeners: {
        'save-partner': '_savePartner',
        'partner-updated': '_partnerSaved'
    },
    _allowEdit: function() {
        return this.checkPermission('editPartnerDetails');
    },
    _allowDownload: function() {
        return !this.checkPermission('editPartnerDetails') && this.checkPermission('downloadPartnerAttachments');
    },
    _savePartner: function() {
        if (!this.$['partner-details'].validate() || !this.$['staff-members'].validate()) {
            this.set('routeData.tab', 'details');
            this.fire('toast', {text: 'Fix invalid fields before saving'});
            return;
        }
        this.updatingInProcess = true;
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
            this.partnerSaved = false;
            this.partnerSavingError = false;
        }
        this.newPartnerDetails = _.cloneDeep(this.partner);

    },
    _partnerSaved: function(event) {
        this.partnerSaved = event.detail.success;
        this.partnerSavingError = !event.detail.success;
        this.updatingInProcess = false;

        this.messageTimeout = setTimeout(() => {
            this.partnerSaved = false;
            this.partnerSavingError = false;
        }, 8000);
    }
});
