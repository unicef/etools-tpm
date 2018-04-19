'use strict';

Polymer({
    is: 'visit-details-tab',

    behaviors: [
        etoolsAppConfig.globals,
        TPMBehaviors.DateBehavior,
        TPMBehaviors.StaticDataController,
        TPMBehaviors.PermissionController,
        TPMBehaviors.CommonMethodsBehavior,
        TPMBehaviors.TextareaMaxRowsBehavior,
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
        'resetValidationErrors(permissionBase)',
        '_errorHandler(errorObject)'
    ],

    ready: function() {
        this.officesList = this.getData('offices');
        this.unicefUsersList = (this.getData('unicefUsers') || []).map((user) => {
            return {
                id: user.id,
                name: `${user.first_name} ${user.last_name}`
            };
        });
    },

    _resetFieldError: function(event) {
        if (!event || !event.currentTarget) { return false; }
        event.currentTarget.invalid = false;
    },

    _visitLoad: function(visit) {
        if (visit && visit.tpm_partner && visit.tpm_partner.id) {
            this.partnerStaffUrl = this.getEndpoint('staffMembers', {id: visit.tpm_partner.id}).url + '?page_size=all';
        }
    },

    _partnersLoad: function(data, details) {
        if (details) {
            this.partners = details.map((partner) => {
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
            unicef_focal_points: this.selectedFocalPoints || [],
            offices: this.selectedOfficers || [],
            tpm_partner_focal_points: this.selectedTpms || []
        };
        let changedData = _.pickBy(data, (value, key) => {
            let original = (this.originalData[key] || []).map((data) => `${data.id}`);
            return !_.isEqual(original, value);
        });

        let oldVisitInformation = _.get(this.originalData, 'visit_information');
        let visitInformation = _.get(this.visit, 'visit_information');

        if (!_.isEqual(visitInformation, oldVisitInformation)) {
            changedData.visit_information = visitInformation;
        }

        return changedData;
    },

    setVisitDates: function(start, end) {
        if (!start) { return '';}
        return [this.prettyDate(start), this.prettyDate(end)].join(' - ');
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
