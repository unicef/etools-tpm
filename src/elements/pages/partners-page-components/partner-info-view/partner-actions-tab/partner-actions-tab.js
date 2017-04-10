'use strict';

Polymer({
    is: 'partner-actions-tab',

    properties: {
        loading: {
            type: Boolean,
            reflectToAttribute: true,
            value: false
        },
        partnerSaved: {
            type: Boolean,
            notify: true
        },
        partnerSavingError: {
            type: Boolean,
            notify: true
        }
    },

    observers: ['_loadingComplete(partnerSaved, partnerSavingError)'],

    _triggerPartnerSave: function() {
        if (this.loading) { return; }
        if (this.partnerSaved) {
            this.partnerSaved = false;
        } else {
            this.partnerSavingError = false;
        }
        this.loading = true;
        this.fire('save-partner');
    },

    _loadingComplete: function(saved, error) {
        this.loading = false;

        if (!saved && !error) {
            this.showMessage = 'hidden';
        } else {
            this.showMessage = '';
            this.success = saved || 'hidden';
            this.error = error || 'hidden';
        }
    }
});
