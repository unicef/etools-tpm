'use strict';

Polymer({
    is: 'trips-page-main',
    observers: [
        '_tabChanged(routeData.view)'
    ],

    _tabChanged: function(view) {
        // console.log(`From trips: ${this.base}/${view}`);
    }
});