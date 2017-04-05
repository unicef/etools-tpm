'use strict';

Polymer({
    is: 'partner-staff-members-tab',

    behaviors: [
        TPMBehaviors.RepeatableDataSetsBehavior
    ],
    properties: {},

    ready: function() {
        this.dataSetModel = {
            id: null,
            title: null,
            first_name: null,
            last_name: null,
            phone: null,
            email: null,
            active: true,
            notify: false
        };
    },

    _canBeRemoved: function(index) {
        if (!this.editMode) {
            return false;
        }
        if (this.dataItems[index] &&
            typeof this.dataItems[index].id !== 'undefined' && this.dataItems[index].id !== null) {
            return false;
        }
        return true;
    },

    _validStaffMemberEmailAddress: function(emailAddress, staffMemberIndex) {
        var emailAddressValid = true;
        var alreadyUsedFilterResult = this.dataItems.filter(function(staffMember, index) {
            return staffMember.email === emailAddress && index !== staffMemberIndex;
        });
        if (alreadyUsedFilterResult.length > 0) {
            // address already used
            emailAddressValid = false;
        } else {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            emailAddressValid = re.test(emailAddress);
        }
        return emailAddressValid;
    },

    _notEmpty: function(value) {
        return typeof value !== 'undefined' && value !== null && value !== '';
    },

    _isValid: function(field, title, firstName, lastName, phoneNumber, emailAddress, index) {
        var valid = true;
        switch (field) {
            case 'title':
                if (!this._notEmpty(title) && (this._notEmpty(firstName) || this._notEmpty(lastName) ||
                    this._notEmpty(phoneNumber) || this._notEmpty(emailAddress))) {
                    valid = false;
                }
                break;
            case 'firstName':
                if (!this._notEmpty(firstName) && (this._notEmpty(title) || this._notEmpty(lastName) ||
                    this._notEmpty(phoneNumber) || this._notEmpty(emailAddress))) {
                    valid = false;
                }
                break;
            case 'lastName':
                if (!this._notEmpty(lastName) && (this._notEmpty(title) || this._notEmpty(firstName) ||
                    this._notEmpty(phoneNumber) || this._notEmpty(emailAddress))) {
                    valid = false;
                }
                break;
            case 'phoneNumber':
                if (!this._notEmpty(phoneNumber) && (this._notEmpty(title) || this._notEmpty(firstName) ||
                    this._notEmpty(lastName) || this._notEmpty(emailAddress))) {
                    valid = false;
                }
                break;
            case 'emailAddress':
                if (this._notEmpty(emailAddress)) {
                    valid = this._validStaffMemberEmailAddress(emailAddress, index);
                } else {
                    if (this._notEmpty(title) || this._notEmpty(firstName) || this._notEmpty(lastName) ||
                        this._notEmpty(phoneNumber)) {
                        valid = false;
                    } else {
                        valid = true; // empty staff member data, hide error msgs
                    }
                }
                break;
        }
        return valid;
    },

    _addNewStaffMember: function() {
        if (this.editMode) {
            var lastStaffMemberAdded = this.dataItems[this.dataItems.length - 1];
            if (lastStaffMemberAdded
                && !this._notEmpty(lastStaffMemberAdded.title)
                && !this._notEmpty(lastStaffMemberAdded.first_name)
                && !this._notEmpty(lastStaffMemberAdded.last_name)
                && !this._notEmpty(lastStaffMemberAdded.phone)
                && !this._notEmpty(lastStaffMemberAdded.email)) {
                this.fire('toast', {text: 'Last staff member fields are empty!', showCloseBtn: true});
            } else {
                this._addElement();
            }
        }
    },
    _getTitleValue: function(value) { return value || ''; }
});