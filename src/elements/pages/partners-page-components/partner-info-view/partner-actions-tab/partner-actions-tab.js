'use strict';

Polymer({
    is: 'partner-actions-tab',

    _triggerPartnerSave: function() {
        this.fire('save-partner');
    }
});
