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

    observers: ['_setPermissionBase(partner.id)'],

    listeners: {
        'save-partner': '_savePartner',
        'partner-updated': '_partnerSaved'
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

    _savePartner: function() {
        if (!this.$['partner-details'].validate() || !this.$['staff-members'].validate()) {
            this.set('routeData.tab', 'details');
            this.fire('toast', {text: 'Fix invalid fields before saving'});
            return;
        }
        this.updatingInProcess = true;

        this.newPartnerDetails = _.cloneDeep(this.partner);
    },

    _partnerSaved: function() {
        this.updatingInProcess = false;
    }
});
