'use strict';

Polymer({
    is: 'partner-info-view-main',

    behaviors: [
        TPMBehaviors.StaticDataController,
        TPMBehaviors.PermissionController
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
    },

    observers: [
        '_setPermissionBase(partner.id)',
        '_routeConfig(route)'
    ],

    listeners: {
        'action-activated': '_processAction',
    },

    ready: function() {
        this.partnerFileTypes = this.getData('partner_attachments_types');
    },
    _routeConfig: function(route) {
        if (!this.route || !~this.route.prefix.indexOf('/partners')) {
            return;
        }
        let tab = this.routeData ? this.routeData.tab : route.path.split('/')[1];
        if (tab === '' || _.isUndefined(tab)) {
            this.set('route.path', '/details');
        } else if (!_.includes(this.tabsList, tab)) {
            this.fire('404');
        }
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

    _attachmentsReadonly: function(base, type) {
        let readOnly = this.isReadonly(`${base}.${type}`);
        if (readOnly === null) { readOnly = true; }
        return readOnly;
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

        let attachmentsTab = Polymer.dom(this.root).querySelector('#attachments');
        let data = this.getPartnerData();
        let promises = [];
        if (attachmentsTab) { promises[0] = attachmentsTab.getFiles(); }

        Promise.all(promises)
            .then((uploadedFiles) => {
                if (uploadedFiles && uploadedFiles[0]) {data.attachments = uploadedFiles[0]; }
                this.newPartnerDetails = {
                    method: method,
                    id: this.partner.id,
                    data: data,
                    message: message,
                    action: details.type
                };
            });
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
