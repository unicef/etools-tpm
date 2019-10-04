'use strict';

Polymer({
    is: 'list-element',

    behaviors: [
        TPMBehaviors.LocalizationBehavior,
    ],

    properties: {
        basePermissionPath: {
            type: String,
            value: ''
        },
        itemValues: {
            type: Object,
            value: function() {
                return {
                    status: {
                        draft: 'Draft',
                        assigned: 'Assigned',
                        tpm_accepted: 'TPM Accepted',
                        tpm_rejected: 'TPM Rejected',
                        tpm_reported: 'TPM Reported',
                        unicef_approved: 'UNICEF Approved',
                        report_submitted: 'Report Submitted',
                        tpm_report_rejected: 'TPM Report Rejected',
                        active: 'Active',
                        cancelled: 'Cancelled'
                    }
                };
            }
        },
        details: {
            type: Array,
            value: function() {
                return [];
            }
        },
        hasCollapse: {
            type: Boolean,
            value: false
        },
        showCollapse: {
            type: Boolean,
            computed: '_computeShowCollapse(details, hasCollapse)'
        },
        notifyContentResize: {
            type: Boolean,
            value: false
        },
        data: {
            type: Object,
            notify: true
        },
        itemIndex: {
            type: Number
        },
        multiline: {
            type: Boolean,
            value: false
        },
        noHover: {
            type: Boolean,
            value: false
        },
        hover: {
            type: Boolean,
            reflectToAttribute: true
        },
        noAdditional: {
            type: Boolean,
            value: false,
            reflectToAttribute: true
        }
    },

    listeners: {
        'mouseover': '_setHover',
        'mouseleave': '_resetHover',
    },

    observers: [
        '_setRightPadding(headings.*)'
    ],

    _setHover: function() {
        this.hover = true;
    },

    _resetHover: function() {
        this.hover = false;
    },

    _setRightPadding: function() {
        if (!this.headings) { return; }
        let rightPadding = 0;
        let padding;

        this.headings.forEach((heading) => {
            if (typeof heading.size === 'string') {
                padding = parseInt(heading.size, 10) || 0;
                rightPadding += padding;
            }
        });

        this.paddingRight = `${rightPadding}px`;
    },

    _computeShowCollapse: function(details, hasCollapse) {
        return details.length > 0 && hasCollapse;
    },

    _toggleRowDetails: function() {
        Polymer.dom(this.root).querySelector('#details').toggle();
        if (this.notifyContentResize) {
            this.fire('content-resize');
        }
    },

    _isOneOfType: function(item) {
        if (!item) { return false; }

        let types = Array.prototype.slice.call(arguments, 1) || [];

        return !!types.find(type => {
            return !!item[type];
        });
    },

    _getValue: function(item, _, bool) {
        let value;

        if (!item.path) {
            value = this.get('data.' + item.name);
        } else {
            value = this.get('data.' + item.path);
        }

        if (item.name === 'type' || item.name === 'status') {
            value = this._refactorValue(item.name, value);
        } else if (item.name === 'date') {
            value = this._refactorTime(value);
        } else if (item.name === 'currency') {
            value = this._refactorCurrency(value);
        } else if (item.name === 'percents') {
            value = this._refactorPercents(value);
        } else if (item.name === 'array') {
            value = this._arrayWithDelimiter(value, item.property, item.delimiter);
        } else if (item.name === 'ordered_list') {
            value = this._arrayAsColumn(value, item.property);
        } else if (item.name === 'files') {
            value = this._refactorFilesLinks(value, item.property);
        } else if (item.name === 'styled_array') {
            value = this._arrayAsColumnWithHighlight(value, item.property, item.options);
        }

        if (bool) {
            value = !!value;
        } else if (!value && value !== 0) {
            return false;
        }

        return value;
    },

    _refactorValue: function(type, value) {
        let values = this.itemValues[type];
        if (values) { return values[value]; }
    },

    _refactorTime: function(value, format = 'DD MMM YYYY') {
        if (!value) { return; }

        let date = new Date(value);
        if (date.toString() !== 'Invalid Date') {
            return moment.utc(date).format(format);
        }
    },

    _refactorCurrency: function(value) {
        if ((!value || isNaN(+value)) && value !== 0) { return; }
        return (+value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    },

    _refactorPercents: function(value) {
        let regexp = /[\d]+.[\d]{2}/;
        return regexp.test(value) ? `${value}%` : null;
    },

    _getPropertyStringValues: function(array, property) {
        let isValidArgs = Array.isArray(array) && property && (typeof property === 'string');
        if (!isValidArgs) { return []; }

        let value;
        let propertyValues = array.map((item) => {
            value = item && item[property];
            return (typeof value === 'string') ? value : undefined;
        });
        propertyValues = propertyValues.filter(item => item);

        return propertyValues;
    },

    _arrayWithDelimiter: function(array, property, delimiter = '; ') {
        let propertyValues = this._getPropertyStringValues(array, property);
        return propertyValues.length ? propertyValues.join(delimiter) : null;
    },

    _arrayAsColumn: function(array, property) {
        let isValidArgs = Array.isArray(array) && property && (typeof property === 'string');

        const nested = property.split('.');
        let styleAttribute = 'style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"';
        let propertyValues = isValidArgs ?
            array.map(value=> {
                return nested.reduce((curr, next) => {
                    return curr[next];
                }, value);
            }) :
            [];

        let html = propertyValues.map((value) => {
            return `<div ${styleAttribute}>${value}</div>`;
        });

        return html.length ? html.join('\n') : '--';
    },

    _arrayAsColumnWithHighlight: function(array, property, options = {delimiter: undefined, style: ''}) {
        let styleAttribute = 'style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"';
        let propertyValues = this._getPropertyStringValues(array, property);

        let splittedValue;
        let splittedValues = propertyValues.map((item) => {
            splittedValue = item.split(options.delimiter);
            if (splittedValue.length > 1) {
                splittedValue[1] = options.delimiter + splittedValue[1];
            } else {
                splittedValue.push('');
            }
            return splittedValue;
        });

        let html = splittedValues.map((splittedValue) => {
            return `<div ${styleAttribute}>
                        <span style="${options.style}">${splittedValue[0]}</span>
                        <span>${splittedValue[1]}</span>
                    </div>`;
        });
        return html.length ? html.join('\n') : '--';
    },

    _refactorFilesLinks: function(files, property) {
        let isValidArgs = (files instanceof Array) && property && (typeof property === 'string');
        if (!isValidArgs) { return '--'; }

        let filesInfo = [];
        let filesHtml = [];
        let value;
        let name;

        files.forEach((object) => {
            value = object[property];
            if (value && (typeof value === 'string')) {
                name = value.split('/').pop();
                filesInfo.push({
                    url: value,
                    name: name,
                });
            }
        });

        filesInfo.forEach((file) => {
            filesHtml.push(`
            <div class="file-link">
                <iron-icon icon="icons:attachment"
                           width="25"
                           height="25"
                           style="color: rgba(0, 0, 0, 0.5);">
                </iron-icon>
                <a class="truncate"
                   target="_blank"
                   download="${file.name}"
                   href="${file.url}"
                   style="color: #0099ff; text-decoration: none; vertical-align: bottom;">
                    ${file.name}
                </a>
            </div>
            `);
        });

        return filesHtml.length ? filesHtml.join('\n') : '--';
    },

    _getAdditionalValue: function(item) {
        if (!item.additional) { return; }

        let additional = item.additional;
        let value = this._getValue(additional);
        let type = additional.type;

        if (type === 'date') {
            value = this._refactorTime(value);
        }

        return value || '–';
    },

    _getStatus: function(synced) {
        if (synced) { return 'Synced from VISION'; }
    },

    _getLink: function(pattern) {
        if (typeof pattern !== 'string') { return '#'; }

        let link = pattern
            .replace('*ap_link*', this.data.url)
            .replace('*data_id*', this.data.id);

        return link.indexOf('undefined') === -1 ? link : '#';
    },

    _emtyObj: function(data) {
        return data && !data.empty;
    },

    _hasProperty: function(data, property, doNotHide) {
        return data && (doNotHide || property && this.get('data.' + property));
    }
});
