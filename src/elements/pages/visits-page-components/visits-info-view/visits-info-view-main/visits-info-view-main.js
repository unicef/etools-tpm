'use strict';

Polymer({
    is: 'visits-info-view-main',

    properties: {
        visit: {
            type: Object,
            notify: true
        }
    },

    observers: ['_setPermissionBase(visit.id)'],

    _setPermissionBase: function(id) {
        id = +id;
        if (!id && id !== 0) {
            this.permissionBase = null;
        } else {
            this.permissionBase = `visit_${id}`;
        }
    },

});
