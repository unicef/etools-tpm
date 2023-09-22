'use strict';

(function() {
    Polymer({
        is: 'partners-list-view',

        behaviors: [
            etoolsAppConfig.globals
        ],

      getLink: function() {
        return window.location.origin + '/fm/partners';
      }

    });
})();
