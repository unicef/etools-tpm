'use strict';

Polymer({
    is: 'partner-info-view-main',

    behaviors: [
        TPMBehaviors.PermissionController
    ],

    properties: {
        fileTypes: {
            type: Array,
            value: [
                {value: '1', display_name: 'Training materials'},
                {value: '2', display_name: 'ToRs'},
                {value: '3', display_name: 'Other'}
            ]
        },
        partner: Object,
        errorObject: {
            type: Object,
            value: function() {
                return {};
            }
        }
    },

    observers: ['_setPermissionBase(partner.id)'],

    listeners: {
        'action-activated': '_processAction',
    },

    _setPermissionBase: function(id) {
        id = +id;
        if (!id && id !== 0) {
            this.permissionBase = null;
        } else {
            this.permissionBase = `partner_${id}`;
        }
    },

    _hideActions: function(permissionBase) {
        if (!permissionBase) { return true; }
        return this.noActionsAllowed(permissionBase);
    },

    _setContainerClass: function(permissionBase) {
        return this._hideActions(permissionBase) ? 'without-sidebar' : '';
    },

    _processAction: function(event, details) {
        if (!details || !details.type) { throw 'Event type is not provided!'; }
        switch (details.type) {
            case 'save':
                this._savePartner();
                break;
            case 'activate':
                this._changePartnerStatus('activate/', 'Activating partner...');
                break;
            case 'cancel':
                this._changePartnerStatus('cancel/', 'Canceling partner...');
                break;
            default:
                console.error(`Unknown event type: ${details.type}`);
        }

    },

    _savePartner: function() {
        if (!this.$.partnerDetails.validate() || !this.$['staff-members'].validate()) {
            this.set('routeData.tab', 'details');
            this.fire('toast', {text: 'Fix invalid fields before saving'});
            return;
        }

        this.newPartnerDetails = {
            method: 'PATCH',
            id: this.partner.id,
            data: this.getPartnerData(),
            message: 'Saving partner...'
        };
    },

    _changePartnerStatus: function(action, message) {
        this.newPartnerDetails = {
            method: 'POST',
            id: this.partner.id,
            data: {},
            link: action,
            message: message
        };
    },

    getPartnerData: function() {
        let data = this.$.partnerDetails.getDetailsData();

        return data || {};
    }

});
