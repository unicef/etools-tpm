Polymer({

    is: 'app-sidebar-menu',

    properties: {
        page: String
    },

    behaviors: [
        etoolsAppConfig.globals
    ],

    setPartnersIcon: function(user) {
        return user.partnerId ? 'person' : 'people';
    },

    setPartnersLink: function(user) {
        return user.partnerId ? `partners/${user.partnerId}/details` : 'partners/list';
    }
});
