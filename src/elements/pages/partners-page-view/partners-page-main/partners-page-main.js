'use strict';

Polymer({
    is: 'partners-page-main',

    properties: {},

    observers: [
        '_tabChanged(routeData.tab)'
    ],

    _tabChanged: function(tab) {
        var tabs = ['list', 'tab2'];
        console.log(tab)
        if (tabs.indexOf(tab) === -1) {
            this.fire('404');
        }
    }
});