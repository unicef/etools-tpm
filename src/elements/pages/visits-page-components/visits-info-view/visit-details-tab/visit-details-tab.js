'use strict';

Polymer({
    is: 'visit-details-tab',

    behaviors: [
        etoolsAppConfig.globals,
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
        }
    },

    ready: function() {
        this.sectionsList = this.getData('sections');
        this.officesList = this.getData('offices');
        this.unicefUsersList = this.getData('unicefUsers').map((user) => {
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
        return {
            sections: this.visit.sections,
            unicef_focal_points: this.visit.unicef_focal_points,
            offices: this.visit.offices,
            tpm_partner_focal_points: this.visit.tpm_partner_focal_points
        };
    }
});
