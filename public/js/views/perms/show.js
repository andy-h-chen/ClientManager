define('PermissionView', [
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'text!templates/perms/show.html',
  'PermissionModel'
], function($, _, Backbone, moment, tpl, Permission) {
  var PermissionView;

  PermissionView = Backbone.View.extend({
    initialize: function() {
      this.template = _.template(tpl);
    },
    events: {
      "click .delete-btn": "removePermission"
    },
    render: function() {
      var that = this, tmpl;

      tmpl = that.template({ perm: this.model.toJSON() });
      $(that.el).html(tmpl);

      return this;
    },
    removePermission: function(e) {
      e.preventDefault();

      this.model.destroy({
        sync: true,
        success: function(model) {
          model.trigger('delete-success');
        },
        error: function(model, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
          }
        }
      })
    }
  });

  return PermissionView;
});
