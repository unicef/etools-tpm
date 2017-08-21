'use strict';

Polymer({
    is: 'visit-details-tab',

    behaviors: [
        etoolsAppConfig.globals,
        TPMBehaviors.DateBehavior,
        TPMBehaviors.StaticDataController,
        TPMBehaviors.PermissionController,
        TPMBehaviors.CommonMethodsBehavior
    ],

    properties: {
        visit: {
            type: Object,
            observer: '_visitLoad'
        },
        partners: {
            type: Array,
            value: function() {
                return [];
            }
        },
        originalData: {
            type: Object,
            value: function() {
                return {};
            }
        }
    },

    observers: [
        'setSelectedSections()'
    ],

    ready: function() {
        this.sectionsList = this.getData('sections');
        this.officesList = this.getData('offices');
        this.unicefUsersList = (this.getData('unicefUsers') || []).map((user) => {
            return {
                id: user.id,
                name: `${user.first_name} ${user.last_name}`
            };
        });

    },

    _visitLoad: function(visit) {
        if (visit && visit.tpm_partner && visit.tpm_partner.id) {
            this.partnerStaffUrl = this.getEndpoint('staffMembers', {id: visit.tpm_partner.id}).url;
        }
    },

    _partnersLoad: function(data, details) {
        if (details) {
            this.partners = details.results.map((partner) => {
                return {
                    id: partner.id,
                    name: `${partner.user.first_name} ${partner.user.last_name}`
                };
            });
        }
    },

    _partnersLoadError: function() {
        console.error(`Can not load partner staff members`);
    },

    getDetailsData: function() {
        let data = {
            sections: this.selectedSections || [],
            unicef_focal_points: this.selectedFocalPoints || [],
            offices: this.selectedOfficers || [],
            tpm_partner_focal_points: this.selectedTpms || []
        };
        return _.pickBy(data, (value, key) => {
            let original = (this.originalData[key] || []).map((data) => `${data.id}`);
            return !_.isEqual(original, value);
        });
    },

    setVisitDates: function(start, end) {
        if (!start) { return '';}
        start = this.prettyDate(start);
        end = this.prettyDate(end);
        return `${start} - ${end}`;
    },

    setSelectedTpms(selected = []) {
        return selected.map((profile) => {
            return {
                id: profile.id,
                name: `${profile.user.first_name} ${profile.user.last_name}`
            };
        });
    }
});
