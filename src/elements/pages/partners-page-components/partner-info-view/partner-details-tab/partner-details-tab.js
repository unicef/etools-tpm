'use strict';

(function() {

    const editableProperties = ['email', 'phone_number'];

    Polymer({
        is: 'partner-details-tab',
        behaviors: [
            TPMBehaviors.PermissionController,
            TPMBehaviors.CommonMethodsBehavior,
            TPMBehaviors.UserController
        ],

        observers: [
            'updateStyles(basePermissionPath)',
            '_errorHandler(errorObject)',
            '_saveOriginalData(partner)'
        ],

        attached: function() {
            this.$.emailInput.validate = this._validEmailAddress.bind(this, this.$.emailInput);
        },

        _setStatus: function(status) {
            if (!status) { return ''; }
            return status[0].toUpperCase() + status.slice(1);
        },

        _getTitleValue: function(value) { return value || ''; },

        validate: function() {
            let elements = Polymer.dom(this.root).querySelectorAll('paper-input:not(.email)'),
                valid = true,
                emailValid = this.$.emailInput.disabled || this.$.emailInput.validate();

            Array.prototype.forEach.call(elements, (element) => {
                if (element.required && !element.disabled && !element.validate()) {
                    element.invalid = 'This field is required';
                    element.errorMessage = `${element.label || 'This field'} is required`;
                    valid = false;
                }
            });

            return valid && emailValid;
        },

        _validEmailAddress: function(emailInput) {
            let value = emailInput.value,
                required = emailInput.required;

            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (required && !value) {
                this.errors = {user: {email: 'Email is required'}};
                return false;
            }
            if (value && !re.test(value)) {
                this.errors = {user: {email: 'Email is incorrect'}};
                return false;
            }

            return true;
        },

        _saveOriginalData: function(partner) {
            if (partner) { this.originalData = _.cloneDeep(partner); }
        },

        getDetailsData: function() {
            let originalData = this.originalData || {};
            if (!_.isObject(originalData) || _.isArray(originalData)) {
                throw `Expect originalData as object but got: ${typeof originalData}}`;
            }

            let data = _.pickBy(_.pick(this.partner, editableProperties), (value, key) => {
                return !_.has(originalData, key) || originalData[key] !== value;
            });

            return _.isEmpty(data) ? null : data;
        },

        getFullAddress: function(partner) {
            let addressItems = [partner.country, partner.city, partner.postal_code, partner.street_address];
            return addressItems.filter((val) => {return val;}).join(', ');
        }

    });

})();
