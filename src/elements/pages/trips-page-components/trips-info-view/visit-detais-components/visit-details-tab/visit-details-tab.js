'use strict';

(function() {
    let partners = [{"value":1,"label":"PC-Collaborator One"},{"value":2,"label":"Ministry of Education, Science and Technology,"},{"value":3,"label":"Garissa County Government  "},{"value":4,"label":"Kenya Primary Headteachers Association"},{"value":5,"label":"Kenya Primary Schools Association"},{"value":6,"label":"Life Skills Promoters "},{"value":8,"label":"County Director of Education Marsabit"},{"value":9,"label":"Ministry of Health"},{"value":10,"label":"SAVE THE CHILDREN INTERNATIONAL"},{"value":11,"label":"INTERNATIONAL RESCUE COMMITTEE"},{"value":13,"label":"CHILDLINE KENYA"},{"value":14,"label":"TERRE DES HOMMES FOUNDATION"},{"value":15,"label":"WORLD VISION KENYA"},{"value":16,"label":"THE CHILD RIGHTS, ADVISORY, DOCUMENTATION & LEGAL CENTRE"},{"value":17,"label":"CARITAS SWITZERLAND"},{"value":18,"label":"SUSTAINABLE AID IN AFRICA"},{"value":19,"label":"KENYA PRIMARY SCHOOLS HEAD TEACHERS ASSOCIATION"},{"value":20,"label":"SAVE THE CHILDREN UK"},{"value":21,"label":"CONCERN WORLDWIDE"},{"value":22,"label":"WINDLE TRUST KENYA"},{"value":23,"label":"HEALTHCARE ASSISTANCE KENYA"},{"value":24,"label":"ASSOCIAZIONE VOLONTARI PER IL SERVIZIO INTERNAZIONALE"},{"value":25,"label":"KENYA RED CROSS SOCIETY"},{"value":26,"label":"MOTHERS2MOTHERS"},{"value":27,"label":"LUTHERAN WORLD FEDERATION"},{"value":28,"label":"TURKANA EDUCATION FOR ALL"},{"value":29,"label":"INTERNATIONAL MEDICAL CORPS, KENYA"},{"value":30,"label":"ACTION AGAINST HUNGER"},{"value":31,"label":"MERCY USA FOR AID AND DEVELOPMENT"},{"value":32,"label":"NETHERLANDS DEVELOPMENT ORGANISATION"}]

    Polymer({
        is: 'visit-details-tab',
        behaviors: [TPMBehaviors.DateBehavior],
        properties: {
            visit: {
                type: Object,
                value: {
                    start: 'Tue Mar 28 2017 08:42:21 GMT+0300 (+03)',
                    end: 'Tue Mar 31 2017 08:42:21 GMT+0300 (+03)'
                }
            },
            editMode: {
                type: Boolean,
                value: true,
                observer: '_editMoseChanged'
            },
            partners: {
                type: Array,
                value: partners
            },
            partnershipDisabled: {
                type: Boolean,
                value: true
            }
        },
        _editMoseChanged: function() {
            this.updateStyles();
        },
        _partnerFieldChanged: function(e) {
            if (this.partnershipDisabled) this.partnershipDisabled = false
        }
    });

})();
