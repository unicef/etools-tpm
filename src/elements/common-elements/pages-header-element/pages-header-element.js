'use strict';

Polymer({
    is: 'pages-header-element',

    properties: {
        title: String,
        showAddButton: {
            type: Boolean,
            value: false
        },
        hidePrintButton: {
            type: Boolean,
            value: false
        },
        data: Object,
        queryParams: {
            type: Object,
            notify: true
        },
        loadCSV: {
            type: Boolean,
            value: false
        },
        csvEndpoint: {
            type: String,
        },
        baseUrl: {
            type: String,
            value: null
        },
        exportType: {
            type: String
        },
        link: {
            type: String,
            value: ''
        },
        exportList: Array,
        pageData: {
            type: Object,
            value: function() {
                return {};
            }
        },
        exportLinks: {
            type: Array,
            value: function() {
                return [];
            }
        },
        downloadLetterUrl: {
            type: String,
            value: ''
        }
    },


    behaviors: [
        etoolsAppConfig.globals,
        TPMBehaviors.QueryParamsController
    ],

    attached: function() {
        this.baseUrl = this.basePath;
    },

    _toggleOpened: function() {
        this.$.dropdownMenu.select(null);
    },

    _hideAddButton: function(show) {
        return !show;
    },

    addNewTap: function() {
        this.fire('add-new-tap');
    },

    _showLink: function(link) {
        return !!link;
    },

    _showBtn: function(link) {
        return !link;
    },

    _setTitle: function(pageData, title) {
        if (!pageData || !pageData.unique_id) { return title; }
        return pageData.unique_id;
    },

    exportData: function(e) {
        if (this.exportLinks.length < 1) { throw 'Can not find export link!'; }
        let url = (e && e.model && e.model.item) ? e.model.item.url : this.exportLinks[0].url;
        const queryString = this.getQueryString(this.parseQueries());
        const urlWithParams = url.concat(queryString);
        window.open(urlWithParams, '_blank');
    },

    _isDropDown: function(exportLinks) {
        return exportLinks && (exportLinks.length > 1 ||
            (exportLinks[0] && exportLinks[0].useDropdown));
    },

    downloadLetter: function() {
        window.open(this.downloadLetterUrl, '_blank');
    }
});
