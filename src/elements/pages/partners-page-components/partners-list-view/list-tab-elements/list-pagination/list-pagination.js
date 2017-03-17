'use strict';

Polymer({
    is: 'list-pagination',
    properties: {
        sizesAllowed: {
            type: Array,
            value: ['10', '25', '50', '100']
        },
        pageSize: {
            type: String,
            notify:true,
            observer: '_sizeChanged'
        }
    },
    _sizeChanged: function(newSize) {
        if (this.sizesAllowed.indexOf(newSize) < 0) this.set('pageSize', '10');
    }
});