define('PermissionListView', [
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'text!templates/perms/index.html',
  'PermissionCollection'
], function($, _, Backbone, moment, tpl, PermissionCollection) {
  var PermissionListView;

  PermissionListView = Backbone.View.extend({
    initialize: function() {
      this.template = _.template(tpl);
      this.collection = new PermissionCollection();
    },
    getData: function(callback) {
      this.collection.fetch({
        success: function(collection) {
          callback(collection);
        },
        error: function(coll, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
          }
        }
      });
    },
    // render template after data refresh
    render: function(callback) {
      var that = this, tmpl;

      this.getData(function(collection) {
        tmpl = that.template({ perms: collection.toJSON() });
        $(that.el).html(tmpl);

        callback();
      });
    }
  });

  return PermissionListView;
});
