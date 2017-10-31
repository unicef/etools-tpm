Polymer({
    is: 'app-sidebar-menu',

    properties: {
        page: String
    },

    behaviors: [
        etoolsAppConfig.globals
    ],

    _toggleDrawer: function() {
        this.fire('drawer-toggle-tap');
    },

    setPartnersIcon: function(user) {
        return user.partnerId ? 'person' : 'people';
    },

    setPartnersText: function(user) {
        return user.partnerId ? 'TPM Partner' : 'Third Party Monitors';
    },

    setPartnersLink: function(user) {
        return user.partnerId ? `partners/${user.partnerId}/details` : 'partners/list?reload=true';
    }
});
