    Polymer({
      is: 'share-documents',
      behaviors: [
        TPMBehaviors.CommonMethodsBehavior,
        TPMBehaviors.TableElementsBehavior,
        TPMBehaviors.StaticDataController,
        etoolsAppConfig.globals,
        EtoolsAjaxRequestBehavior,
      ],

      properties: {
        selectedTask: {
          type: Object,
          notfiy: true,
          observer: '_taskSelected'
        },

        selectedFiletype: {
          type: Object,
          value: '',
          observer: '_filterByFileType'
        },

        orderBy: {
          type: String,
          value: 'asc'
        },
        checkedIds: {
          type: Array,
        },

        documentsList: {
          type: Array,
        },

        headingColumns: {
          type: Array,
          value: [
            {
              'size': 16,
              'label': 'PD/SSFA',
              'name': 'pddsfa',
              'ordered': 'asc'
            },
            {
              'size': 30,
              'label': 'Document Type',
              'noOrder': true,
              'class': 'no-order'
            },
            {
              'size': 30,
              'label': 'Document',
              'noOrder': true,
              'class': 'no-order'
            },
            {
              'size': 20,
              'label': 'Date Uploaded',
              'noOrder': true,
              'class': 'no-order right'
            }
          ]
        },

        fileTypes: {
          type: Array
        },

        filteredList: {
          type: Array,
        },

        originalList: {
          type: Array
        },

        relatedTasks: {
          type: Array,
        },

        selectedAttachments: {
          type: Array,
          value: []
        },

        requestOptions: {
          type: Object,
          value: {
            csrf: true
          }
        },

        confirmDisabled: {
          type: Boolean,
          notify: true,
          reflectToAttribute: true,
        },

        shareParams: {
          type: Boolean,
          notify: true,
          reflectToAttribute: true,
        }
      },

      observers: [
        '_handleDisabledConfirm(selectedAttachments.length)'
      ],

      attached: function () {
        this.set('requestOptions.endpoint', this.getEndpoint('globalAttachments'));

        const fileTypes = _.get(this.getData("staticDropdown"), "attachment_types_active")
        .filter(val=>!_.isEmpty(val))
        .map(
          typeStr => ({ label: typeStr, value: typeStr })
        );

        const uniques = _.uniqBy(fileTypes, 'label');

        this.set('fileTypes', uniques);
      },

      _taskSelected: function (selectedTask) {
        if (!selectedTask) { return; }

        this.fire('global-loading', {
          type: 'share-documents',
          active: true,
          message: 'Fetching documents...'
        });

        const options = Object.assign(this.requestOptions, {
          params: {
            partner: selectedTask.partner.name,
            source: 'Partnership Management Portal'
          }
        });

        this.sendRequest(options).then(
          resp => {
            this.set('originalList', resp);
            this.set('filteredList', resp);
            this.fire('global-loading', { type: 'share-documents' });
            this.fire('content-resize');
          }
        ).catch(err => console.log(err));
      },

      _toggleChecked: function (e) {
        const {id} = e.model.item;
        const target = Polymer.dom(e).localTarget;
        const isChecked = target.checked;
        if (isChecked) {
          this.push('selectedAttachments', {attachment: id});
        } else {
          let cloned = _.clone(this.selectedAttachments);
          _.remove(cloned, { attachment: id});
          this.set('selectedAttachments', cloned);
        }

        this._updateShareParams();
      },

      _updateShareParams: function(){
        this.set('shareParams', {
          id: this.selectedTask.id,
          attachments: this.selectedAttachments
        });
      },

      _orderChanged: function ({ detail }) {
        const newOrder = detail.item.ordered === 'desc' ? 'asc' : 'desc';
        this.set(`headingColumns.${detail.index}.ordered`, newOrder);
        this._handleSort(newOrder);
      },

      _handleSort: function(sortOrder){
        const sorted = this.filteredList.slice(0).sort((a,b)=> {
            if (a.pd_ssfa_number > b.pd_ssfa_number) {
              return sortOrder === 'asc' ? -1 : 1;
            } else if (a.pd_ssfa_number < b.pd_ssfa_number) {
              return sortOrder === 'asc' ? 1 : -1;
            } else {
              return 0;
            }
        });
        this.set('filteredList', sorted);
      },

      _filterByFileType: function(selectedFileType){
        if (selectedFileType === '') { return; }
        if (selectedFileType === null) {
          // resets list when doc-type filter is cleared
          this.set('filteredList', this.originalList);
          return;
        }
        const { value } = selectedFileType;
        const newFilteredList = this.originalList.filter(row => row.file_type.toLowerCase() === value.toLowerCase());
        this.set('filteredList', newFilteredList)
      },

      resetValues: function(){
        this.set('selectedAttachments', []);
        this.set('filteredList', []);
        this.set('shareParams', {});
      },

      _handleDisabledConfirm: function(length) {
        if (typeof length !== 'number') {
          return;
        }
        this.set('confirmDisabled', length === 0);
      },

      _getTruncatedPd: function (pdNumber) {
        if (!pdNumber) {
          return '';
        }
        return `.../${_.last(pdNumber.split('/'))}`;
      }

    });
