'use strict';

Polymer({
    is: 'partner-info-view-main',
    behaviors: [TPMBehaviors.PermissionController],
    properties: {
        fileTypes: {
            type: Array,
            value: [
                {id: '1', name: 'Training materials'},
                {id: '2', name: 'ToRs'},
                {id: '3', name: 'Other'}
            ]
        },
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
