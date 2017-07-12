'use strict';

Polymer({
    is: 'partner-info-view-main',

    behaviors: [
        TPMBehaviors.PermissionController
    ],

    properties: {
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
        let message, method;
        switch (details.type) {
            case 'save':
                method = 'PATCH';
                break;
            case 'activate':
                method = 'POST';
                message = 'Activating partner...';
                break;
            case 'cancel':
                method = 'POST';
                message = 'Canceling partner...';
                break;
            default:
                throw `Unknown event type: ${details.type}`;
        }

        if (!this.validatePartner()) { return; }

        this.newPartnerDetails = {
            method: method,
            id: this.partner.id,
            data: this.getPartnerData(),
            message: message,
            action: details.type
        };
    },

    validatePartner: function() {
        let detailsValid = this.$.partnerDetails.validate(),
            staffMembersValid = this.$.staffMembers.validate();

        if (!detailsValid || !staffMembersValid) {
            this.set('routeData.tab', 'details');
            this.fire('toast', {text: 'Fix invalid fields before saving'});
            return false;
        }

        return true;
    },

    getPartnerData: function() {
        let data = this.$.partnerDetails.getDetailsData();

        return data || {};
    }

});
