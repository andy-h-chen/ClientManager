define('UserView', [
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'text!templates/users/show.html',
  'UserModel'
], function($, _, Backbone, moment, tpl, User) {
  var UserView;

  UserView = Backbone.View.extend({
    initialize: function() {
      this.template = _.template(tpl);
    },
    events: {
      "click .delete-btn": "removeUser"
    },
    render: function() {
      var that = this, tmpl;

      tmpl = that.template({ user: this.model.toJSON() });
      $(that.el).html(tmpl);

      return this;
    },
    removeUser: function(e) {
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

  return UserView;
});
