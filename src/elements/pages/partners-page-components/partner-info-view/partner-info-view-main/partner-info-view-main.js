'use strict';

Polymer({
    is: 'partner-info-view-main',
    properties: {
        partner: {
            type: Object,
            notify: true,
            value: {"id":30,"staff_members":[],"assessments":[{"id":1,"report_file":null,"type":"Micro Assessment","names_of_other_agencies":null,"expected_budget":null,"notes":null,"requested_date":"2016-09-06","planned_date":null,"completed_date":"2016-09-06","rating":"high","report":null,"current":true,"partner":30,"requesting_officer":null,"approving_officer":null}],"hact_values":{"audits_done":0,"planned_visits":0,"spot_checks":0,"programmatic_visits":0,"follow_up_flags":0,"planned_cash_transfer":0,"micro_assessment_needed":"Missing","audits_mr":0},"core_values_assessment_file":null,"interventions":[],"partner_type":"Civil Society Organization","cso_type":"International NGO","name":"ACTION AGAINST HUNGER","short_name":"","description":"","shared_with":null,"shared_partner":"No","street_address":null,"city":null,"postal_code":null,"country":null,"address":"ISAAC GATHANJU ROAD","email":null,"phone_number":"020 4348581","vendor_number":"2500220645","alternate_id":null,"alternate_name":"","rating":"Low","type_of_assessment":"Micro Assessment","last_assessment_date":"2015-10-23","core_values_assessment_date":"2013-07-10","core_values_assessment":null,"vision_synced":true,"blocked":false,"hidden":false,"deleted_flag":false,"total_ct_cp":"1833397.68","total_ct_cy":"629599.86"}
        }
    }
});