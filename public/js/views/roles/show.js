define('RoleView', [
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'text!templates/roles/show.html',
  'RoleModel'
], function($, _, Backbone, moment, tpl, Role) {
  var RoleView;

  RoleView = Backbone.View.extend({
    initialize: function() {
      this.template = _.template(tpl);
    },
    events: {
      "click .delete-btn": "removeRole"
    },
    render: function() {
      var that = this, tmpl;

      tmpl = that.template({ role: this.model.toJSON() });
      $(that.el).html(tmpl);

      return this;
    },
    removeRole: function(e) {
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

  return RoleView;
});
