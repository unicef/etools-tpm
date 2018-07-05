'use strict';

Polymer({
    is: 'ap-items',

    properties: {
        actionPoints: {
            type: Array,
            value: () => []
        },
        activityId: {
            type: Number,
            observer: 'updateTable'
        },
        columns: {
            type: Array,
            value: () => [{
                'size': 10,
                'label': 'Reference Number #',
                'name': 'reference_number',
                'link': '*ap_link*',
                'ordered': false,
                'path': 'reference_number',
                'target': '_blank'
            }, {
                'size': 8,
                'label': 'Status',
                'labelPath': 'status',
                'align': 'left',
                'property': 'status',
                'path': 'status',
                'class': 'caps'
            }, {
                'size': 7,
                'label': 'High Priority',
                'labelPath': 'high_priority',
                'path': 'high_priority',
                'align': 'center',
                'checkbox': true
            }, {
                'size': 11,
                'label': 'Due Date',
                'labelPath': 'due_date',
                'path': 'due_date',
                'name': 'date',
                'align': 'center'
            }, {
                'size': 12,
                'label': 'Person Responsible',
                'labelPath': 'assigned_to',
                'path': 'assigned_to.name',
                'align': 'center'
            }, {
                'size': 12,
                'label': 'Office',
                'labelPath': 'office',
                'path': 'office.name'
            }, {
                'size': 12,
                'label': 'Section',
                'labelPath': 'section',
                'path': 'section.name'
            }, {
                'size': 28,
                'label': 'Description',
                'labelPath': 'description',
                'path': 'description',
                'hideTooltip': true
            }]
        }
    },

    editAP: function(event) {
        let item = event && event.model && event.model.item,
            index = this.actionPoints.indexOf(item);

        if ((!index && index !== 0) || !~index) {
            throw 'Can not find data';
        }

        let taskAP = {actionPoint: item};
        this.fire('edit-action-point', {taskAP});
    },

    isEditable: function(actionPoint) {
        return actionPoint && actionPoint.status !== 'completed';
    },

    _showAP: function(actionPoint) {
        return actionPoint.tpm_activity === this.activityId;
    },

    updateTable: function() {
        this.$['ap-repeat'].render();
    }

});
