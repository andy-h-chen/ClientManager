define('RoleListView', [
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'text!templates/roles/index.html',
  'RoleCollection'
], function($, _, Backbone, moment, tpl, RoleCollection) {
  var RoleListView;

  RoleListView = Backbone.View.extend({
    initialize: function() {
      this.template = _.template(tpl);
      this.collection = new RoleCollection();
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
        tmpl = that.template({ roles: collection.toJSON() });
        $(that.el).html(tmpl);

        callback();
      });
    }
  });

  return RoleListView;
});
