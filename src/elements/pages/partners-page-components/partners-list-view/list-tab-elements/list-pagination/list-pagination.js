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
        },
        pageNumber: {
            type: String,
            notify: true,
            observer: '_pageChanged'
        }
    },
    _sizeChanged: function(newSize) {
        if (this.sizesAllowed.indexOf(newSize) < 0) this.set('pageSize', '10');
    },
    _pageChanged: function() {

    },
    goToFirst: function() { this.set('pageNumber', '1'); },
    goToLeft: function() { this.set('pageNumber', `${+this.pageNumber - 1}`); },
    goToRight: function() { this.set('pageNumber', `${+this.pageNumber + 1}`); },
    goToLast: function() { this.set('pageNumber', '999999'); }
});