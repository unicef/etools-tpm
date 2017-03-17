'use strict';

Polymer({
    is: 'list-element',
    _toggleRowDetails: function() {
        this.$.details.toggle();
    }
});