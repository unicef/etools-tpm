'use strict';

Polymer({
    is: 'partners-page-main',

    observers: [
        '_tabChanged(routeData.view)'
    ],

    _tabChanged: function(view) {
        var tabs = ['list', 'info'];
        if (tabs.indexOf(view) === -1) {
            this.fire('404');
        }
    }
});