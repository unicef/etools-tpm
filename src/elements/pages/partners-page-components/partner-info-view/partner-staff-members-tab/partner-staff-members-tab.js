'use strict';

Polymer({
    is: 'partner-staff-members-tab',

    behaviors: [
        TPMBehaviors.TableElementsBehavior,
        TPMBehaviors.CommonMethodsBehavior
    ],

    properties: {
        basePermissionPath: {
            type: String
        },
        mainProperty: {
            type: String,
            value: 'user'
        },
        partnerId: {
            type: String
        },
        dataItems: {
            type: Array,
            value: function() {
                return [];
            }
        },
        itemModel: {
            type: Object,
            value: function() {
                return {
                    user: {
                        first_name: '',
                        last_name: '',
                        email: '',
                        profile: {
                            job_title: '',
                            phone_number: ''
                        },
                        is_active: true
                    }
                };
            }
        },
        columns: {
            type: Array,
            value: function() {
                return [
                    {
                        'size': 20,
                        'label': 'Position',
                        'labelPath': 'user.profile.job_title',
                        'name': 'user.profile.job_title'
                    }, {
                        'size': 20,
                        'label': 'First Name',
                        'labelPath': 'user.first_name',
                        'name': 'user.first_name'
                    }, {
                        'size': 20,
                        'label': 'Last Name',
                        'labelPath': 'user.last_name',
                        'name': 'user.last_name'
                    }, {
                        'size': 20,
                        'label': 'Phone Number',
                        'labelPath': 'user.profile.phone_number',
                        'name': 'user.profile.phone_number'
                    }, {
                        'size': 20,
                        'label': 'E-mail Address',
                        'labelPath': 'user.email',
                        'name': 'user.email'
                    }, {
                        'size': '50px',
                        'label': 'Active',
                        'labelPath': 'user.is_active',
                        'icon': 'check',
                        'align': 'center',
                        'name': 'user.is_active'
                    }
                ];
            }
        },
        addDialogTexts: {
            type: Object,
            value: function() {
                return {
                    title: 'Add new TPM Contact'
                };
            }
        },
        editDialogTexts: {
            type: Object,
            value: function() {
                return {
                    title: 'Edit TPM Contact'
                };
            }
        },
        listQueries: {
            type: Object,
            value: function() {
                return {
                    page: 1,
                    page_size: 10
                };
            }
        },
        listLoading: {
            type: Boolean,
            value: false
        },
        showingResults: {
            type: String,
            computed: '_calcShowingResults(datalength, listSize, listPage, searchQuery, dataItems.length)'
        },
        datalength: {
            type: Number,
            value: 0
        },
        searchQuery: {
            type: String,
            value: ''
        },
        tabTitle: {
            type: String,
            value: '',
            computed: 'setTabTitle(permissionBase, datalength, dataItems.length, searchQuery)'
        }
    },

    listeners: {
        'dialog-confirmed': '_addStaffFromDialog',
        'staff-updated': '_staffUpdated'
    },

    observers: [
        'resetDialog(dialogOpened)',
        '_handleUpdateError(errorObject.staff_members)',
        '_queriesChanged(listSize, listPage, searchQuery)',
        'updateStyles(emailChecking, basePermissionPath, addDialog)',
        'resetQueries(partnerId)'
    ],

    attached: function() {
        this.$.emailInput.validate = this._validEmailAddress.bind(this, this.$.emailInput);
        this.resetQueries();
    },

    resetQueries: function() {
        this.listSize = 10;
        this.listPage = 1;
    },

    _queriesChanged: function(listSize, listPage, searchQuery) {
        if (!listPage || !listSize) { return; }

        if (((this.lastSize && this.lastSize !== listSize) ||
            (!_.isUndefined(this.lastSearchQuery) && this.lastSearchQuery !== searchQuery)) && this.listPage !== 1) {
            this.lastSearchQuery = searchQuery;
            this.lastSize = listSize;
            this.listPage = 1;
            return;
        }
        this.lastSize = listSize;
        this.lastSearchQuery = searchQuery;

        this.set('listQueries', {
            page_size: listSize,
            page: listPage,
            search: searchQuery || ''
        });
    },

    validate: function() {
        let elements = Polymer.dom(this.root).querySelectorAll('.validate-input:not(.email)'),
            valid = true,
            emailValid = this.$.emailInput.disabled || this.$.emailInput.validate();

        Array.prototype.forEach.call(elements, (element) => {
            if (element.required && !element.disabled && !element.validate()) {
                element.invalid = 'This field is required';
                element.errorMessage = 'This field is required';
                valid = false;
            }
        });

        return valid && emailValid;
    },

    _calcShowingResults: function(datalength, listSize, listPage, searchQuery, itemsLength) {
        let last = listSize * listPage,
            first = last - listSize + 1,
            length = searchQuery ? itemsLength : datalength;

        if (last > length) { last = length; }
        if (first > length) { first = 0; }
        return `${first}-${last} of ${length}`;
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

        let valid = true;

        if (this.saveWithButton) {
            _.each(this.dataItems, item => {
                if (item.user && item.user.email === this.editedItem.user.email &&
                    item.id && item.id === this.editedItem.id) {
                    this.errors = {user: {email: 'Email must be unique'}};
                    valid = false;
                }
            });
        }

        return valid;
    },

    _emailDisabled: function(request, createPopup, emailChecking) {
        return !!(!createPopup || request || emailChecking);
    },

    _checkEmail: function(event) {
        if (this.emailChecking) { return; }

        let input = event && event.target,
            value = input && input.value;

        if (value && this._validEmailAddress(input)) {
            this.newEmail = value;
        }
    },

    _showPagination: function(dataItems) {
        return !!(+dataItems && +dataItems > 10);
    },

    _staffLength: function(length, length2, search) {
        let staffLength = search ? length2 : length || length2;
        return staffLength || 0;
    },

    _addStaffFromDialog: function() {
        if (this.requestInProcess) { return; }

        if (!this.validate()) { return; }

        this.requestInProcess = true;

        let item = _.cloneDeep(this.editedItem);
        if (!this.addDialog && !isNaN(this.editedIndex)) {
            if (_.isEqual(this.originalEditedObj, this.editedItem)) {
                this.requestInProcess = false;
                this.dialogOpened = false;
                this.resetDialog();
                return;
            }
            this.set('newData', {
                method: 'PATCH',
                data: item,
                staffIndex: this.editedIndex,
                id: `${item.id}/`
            });
        } else {
            this.set('newData', {
                method: 'POST',
                data: item,
                id: ''
            });
        }
    },

    _staffUpdated: function(event, details) {
        if (!details) { throw 'Detail are not provided!'; }
        if (details.error) {
            this._handleUpdateError(details.errorData);
            return;
        }

        if (details.action === 'patch') {
            this.splice('dataItems', details.index, 1, details.data);
        } else if (details.action === 'post') {
            this.set('listPage', 0);
            this.set('listPage', 1);
        }
        this.requestInProcess = false;
        this.dialogOpened = false;
        this.resetDialog();
    },

    _handleUpdateError: function(errorData) {
        let nonField = this.checkNonField(errorData);
        let error =  this.refactorErrorObject(errorData);

        this.set('errors', error);
        this.requestInProcess = false;
        if (_.isString(error)) {
            let text = !!~error.indexOf('required') ? 'Please, select at least one staff member.' : error;
            this.fire('toast', {text: `TPM Contacts: ${text}`});
        }
        if (nonField) {
            this.fire('toast', {text: `TPM Contacts: ${nonField}`});
        }
    },

    _getSearchInputClass: function(searchString) {
        if (searchString) { return 'filled'; }
        return 'empty';
    },

    searchBlur: function() {
        this.updateStyles();
    },

    _searchChanged: function() {
        let value = this.$.searchInput.value || '';

        if (value.length - 1) {
            this.debounce('newRequest', () => {
                this.set('searchQuery', value);
            }, 500);
        }
    },

    setTabTitle: function(basePermissionPath, datalength, dataItems, searchQuery) {
        if (!basePermissionPath) { return; }
        let title = this.getFieldAttribute(`${basePermissionPath}.staff_members`, 'label', 'GET');
        return `${title} (${this._staffLength(datalength, dataItems, searchQuery)})`;
    }
});
