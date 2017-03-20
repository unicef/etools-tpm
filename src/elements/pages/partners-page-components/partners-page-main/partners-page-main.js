'use strict';

Polymer({
    is: 'partners-page-main',
    behaviors: [MyBehaviors.QueryParamsController],
    properties: {
        queryParams: {
            type: Object,
            notify: true
        }
    },
    observers: [
        '_tabChanged(routeData.view)'
    ],

    _tabChanged: function(view) {
        if (this.base !== 'partners') return;
        console.log(this.parseQueries());
        var tabs = ['list', 'info'];
        // if (tabs.indexOf(view) === -1) {
        //     this.fire('404');
        // }
    }
});