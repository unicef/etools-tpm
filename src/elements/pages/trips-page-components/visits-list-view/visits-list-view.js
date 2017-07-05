'use strict';

(function() {
    Polymer({
        is: 'visits-list-view',

        behaviors: [
            etoolsAppConfig.globals,
            TPMBehaviors.PermissionController,
        ],

        properties: {
            queryParams: {
                type: Object,
                notify: true
            },
            listHeadings: {
                type: Array,
                value: [{
                    'size': 20,
                    'label': 'Reference #',
                    'name': 'reference_number',
                    'link': 'visits/*data_id*/details',
                    'ordered': false
                }, {
                    'size': 30,
                    'label': 'Vendor Name',
                    'name': 'name',
                    'ordered': false
                }, {
                    'size': 30,
                    'label': 'Implementing Partner',
                    'name': 'partner.name',
                    'ordered': false
                }, {
                    'size': 20,
                    'label': 'Status',
                    'name': 'status',
                    'ordered': false
                }]
            },
            listDetails: {
                type: Array,
                value: function() {
                    return [{
                        'size': 20,
                        'label': 'Location',
                        'name': 'location'
                    }, {
                        'size': 20,
                        'label': 'UNICEF Focal Point',
                        'name': 'focal_point'
                    }];
                }
            },
            visitsList: {
                type: Array,
                value: []
            },
        },

        _showAddButton: function() {
            return this.actionAllowed('new_visit', 'addVisit');
        },

        _setExportLink: function() {
            return this.getEndpoint('visitsList').url + '?format=csv&page_size=all';
        }
    });
})();
