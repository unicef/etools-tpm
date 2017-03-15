'use strict';

(function() {
    let filters = [
        {
            name: 'Status',
            filterName: 'f_status',
            selection: [
                {
                    label: 'Planned',
                    value: 0,
                    apiValue: 'planned'
                },
                {
                    label: 'Submitted',
                    value: 1,
                    apiValue: 'submitted'
                },
                {
                    label: 'Rejected',
                    value: 2,
                    apiValue: 'rejected'
                },
                {
                    label: 'Approved',
                    value: 3,
                    apiValue: 'approved'
                }
                ]
        },
        {
            name: 'Implementing Partner',
            filterName: 'f_impl_partner',
            selection: []
        },
        {
            name: 'Location',
            filterName: 'f_location',
            selection: []
        },
        {
            name: 'UNICEF Focal Point',
            filterName: 'f_focal_point',
            selection: []
        }
    ];

    Polymer({
        is: 'search-and-filter',
        properties: {
            usedFilters: {
                type: Array,
                value: [],
            },
            availableFilters: {
                type: Array,
                value: filters
            }
        },
        searchKeyDown: function(e) {
            //    search logic
        },
        addFilter: function(e) {
            var newFilter = filters.filter(function(filter) {
                return filter.name === e.model.item.name;
            })[0];

            this.set('availableFilters', this.availableFilters.filter(function(filter) {
                return filter.name !== newFilter.name;
            }));

            this.push('usedFilters', newFilter);
        },
        removeFilter: function(e) {

            var filterName = e.model.item.name;
            var pristineFilter = filters.filter(function(filter) {
                return filter.name === filterName;
            })[0];

            this.push('availableFilters', pristineFilter);

            var indexToRemove = this.usedFilters.indexOf(e.model.item);

            this.splice('usedFilters', indexToRemove, 1);
        }
    });
})();