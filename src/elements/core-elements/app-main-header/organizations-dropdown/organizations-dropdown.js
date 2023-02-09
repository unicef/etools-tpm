Polymer({
  is: 'organizations-dropdown',

    behaviors: [
        etoolsAppConfig.globals,
        etoolsBehaviors.EtoolsRefreshBehavior
    ],

    properties: {
        opened: {
            type: Boolean,
            reflectToAttribute: true,
            value: false
        },
      organizations: {
            type: Array,
            value: []
        },
      organizationId: {
            type: Number
        },
        organizationIndex: {
            type: Number
        }
      },

    listeners: {
        'paper-dropdown-close': '_toggleOpened',
        'paper-dropdown-open': '_toggleOpened'
    },

    observers: [
        '_setOrganizationIndex(organizations, organizationId)',
        '_showDropdown(organizations)'
    ],

  _setOrganizationIndex: function(organizations, organizationId) {
    if (!(organizations instanceof Array)) { return; }

    this.organizationIndex = organizations.findIndex((organization) => {
      return organization.id === organizationId;
        });
    },

    _toggleOpened: function() {
        this.set('opened', this.$.dropdown.opened);
    },

    _organizationSelected: function(e) {
      this.set('organization', this.$.repeat.itemForElement(e.detail.item));
    },

  _changeOrganization: function(event) {
    let organization = event && event.model && event.model.item,
      id = organization && organization.id;

    if (Number(parseFloat(id)) !== id) {throw 'Can not find organization id!'; }

    this.fire('global-loading', {type: 'change-organization', active: true, message: 'Please wait while organization is changing...'});
    this.organizationData = {organization: id};
    this.url = this.getEndpoint('changeOrganization').url;
    },

    _handleError: function() {
      this.organizationData = null;
      this.url = null;
      this.fire('global-loading', {type: 'change-organization'});
      this.fire('toast', {text: 'Can not change organization. Please, try again later'});
    },

    _handleResponse: function() {
        this.refreshInProgress = true;
        this.clearDexieDbs();
    },

    _showDropdown: function(organizations) {
      this.hidden = !organizations.length;
    },

    _refreshPage: function() {
        this.refreshInProgress = false;
        window.location.href = `${window.location.origin}/tpm/`;
    }
});
