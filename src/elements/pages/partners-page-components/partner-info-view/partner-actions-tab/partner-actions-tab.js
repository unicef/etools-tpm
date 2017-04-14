'use strict';

Polymer({
    is: 'partner-actions-tab',

    properties: {
        loading: {
            type: Boolean,
            reflectToAttribute: true,
            value: false,
            notify: true
        },
        partnerSaved: {
            type: Boolean,
            notify: true,
            observer: '_loadingComplete'
        },
        partnerSavingError: {
            type: Boolean,
            notify: true,
            observer: '_loadingError'
        }
    },

    _triggerPartnerSave: function() {
        if (this.loading) { return; }
        this.fire('save-partner');
    },

    _loadingComplete: function(saved) {
        this.success = saved || 'hidden';
        if (this.error === 'hidden' && this.success === 'hidden') {
            this.showMessage = 'hidden';
        } else {
            this.showMessage = true;
        }
    },
    _loadingError: function(error) {
        this.error = error || 'hidden';
        if (this.error === 'hidden' && this.success === 'hidden') {
            this.showMessage = 'hidden';
        } else {
            this.showMessage = true;
        }
    }
});
