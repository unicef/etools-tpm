'use strict';

Polymer({
    is: 'partner-details-tab',
    behaviors: [
        TPMBehaviors.PermissionController,
        TPMBehaviors.CommonMethodsBehavior,
        TPMBehaviors.UserController
    ],

    observers: [
        'updateStyles(basePermissionPath)',
        '_errorHandler(errorObject)'
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
    }
});
