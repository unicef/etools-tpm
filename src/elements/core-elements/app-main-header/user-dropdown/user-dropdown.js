Polymer({

    is: 'user-dropdown',

    properties: {
        opened: {
            type: Boolean,
            reflectToAttribute: true,
            value: false
        },
        isAdmin: {
            type: Boolean,
            value: false
        }
    },

    listeners: {
        'paper-dropdown-close': '_toggleOpened',
        'paper-dropdown-open': '_toggleOpened'
    },

    _toggleOpened: function() {
        this.set('opened', this.$.dropdown.opened);
    },

    _selectUser: function() {
        this.isAdmin = false;
    },

    _selectAdmin: function() {
        this.isAdmin = true;
    }

});
