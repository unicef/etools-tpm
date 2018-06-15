'use strict';

Polymer({
    is: 'partner-info-view-main',

    behaviors: [
        etoolsAppConfig.globals,
        TPMBehaviors.StaticDataController,
        TPMBehaviors.PermissionController,
        TPMBehaviors.CommonMethodsBehavior,
        TPMBehaviors.RouterBehavior
    ],

    properties: {
        partner: Object,
        errorObject: {
            type: Object,
            value: function() {
                return {};
            }
        },
        tabsList: {
            type: Array,
            value: function() {
                return ['details', 'attachments'];
            }
        },
        pagePrefix: {
            type: String,
            value: '/partners'
        },
    },

    observers: [
        '_setPermissionBase(partner.id)',
        '_routeConfig(route)',
        '_setVisionStatus(partner)',
        '_errorOccurred(errorObject)'
    ],

    listeners: {
        'action-activated': '_processAction',
    },

    ready: function() {
        this.statuses = this.getData('partner_statuses');
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
        if (!details || !details.type) {
            throw 'Event type is not provided!';
        }
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

        let data = this.getPartnerData();

        this.newPartnerDetails = {
            method: method,
            id: this.partner.id,
            data: data,
            message: message,
            action: details.type,
            quietAdding: details.quietAdding
        };
    },

    validatePartner: function() {
        let detailsValid = this.$.partnerDetails.validate();

        if (!detailsValid) {
            this.set('routeData.tab', 'details');
            this.fire('toast', {text: 'Fix invalid fields before saving'});
            return false;
        }

        return true;
    },

    getPartnerData: function() {
        let data = this.$.partnerDetails.getDetailsData();
        return data || {};
    },

    _setVisionStatus: function(partner) {
        let {vision_synced: synced, blocked, deleted_flag: deleted} = partner || {};

        if (!synced) {
            this._setVisionTexts('not_synced', 'Not Synced');
        } else if (deleted) {
            this._setVisionTexts('deleted', 'Marked For Deletion in VISION');
        } else if (blocked) {
            this._setVisionTexts('blocked', 'Blocked in VISION');
        } else {
            this._setVisionTexts('synced', 'Synced from VISION');
        }
    },

    _setVisionTexts: function(status, text) {
        this.set('visionStatusName', text);
        this.set('visionStatus', status);
    },
    _setExportLinks: function(partner) {
        return [{
            url: this.getEndpoint('partnerExport', {id: partner.id}).url
        }];
    }
});
