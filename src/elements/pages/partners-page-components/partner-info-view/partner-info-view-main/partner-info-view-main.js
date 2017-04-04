'use strict';

Polymer({
    is: 'partner-info-view-main',
    behaviors: [TPMBehaviors.PermissionController],
    properties: {
        partner: {
            type: Object,
            notify: true
        }
    },
    _allowEdit: function() {
        return this.checkPermission('editPartnerDetails');
    },
    _allowDownload: function() {
        return !this.checkPermission('editPartnerDetails') && this.checkPermission('downloadPartnerAttachments');
    }
});