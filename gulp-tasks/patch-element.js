const gulp = require('gulp'),
    fs = require('fs'),
    through2 = require('through2').obj;

let property = ",observer: 'searchChanged'",
    method = `,searchChanged: function (search) {let id = this.label || this.getAttribute('id');this.fire('esmm-search-changed', {value: search, id: id});}`

module.exports = through2((file, enc, callback) => {
    if (file.basename === 'etools-searchable-multiselection-menu.html') {
        let content = String(file.contents);
        if (!~content.indexOf('searchChanged: function')) {
            let propertyIndex = content.indexOf(`
          },
          label: {
            type: String`);
            let methodIndex = content.indexOf(`}

      });
    })();
  </script>
</dom-module>`) + 1;

            let newContent = content.slice(0, propertyIndex) + property + content.slice(propertyIndex, methodIndex) + method + content.slice(methodIndex);
            file.contents = new Buffer(String(newContent));
        }
    }
    callback(null, file);
});