'use strict';

Polymer({
    is: 'list-pagination',
    properties: {
        rowSelection: {
            type: Array,
            value: ['10', '25', '50', '100']
        }
    }
});