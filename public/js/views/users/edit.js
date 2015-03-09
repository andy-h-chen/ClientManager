define('UserEditView', [
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'text!templates/users/edit.html',
  'UserModel'
], function($, _, Backbone, moment, tpl, User) {
  var UserEditView;

  UserEditView = Backbone.View.extend({
    initialize: function() {
      this.template = _.template(tpl);

      this.errTmpl  = '<div class="span4">';
      this.errTmpl += '<div class="alert alert-error">';
      this.errTmpl += '<button type="button" class="close" data-dismiss="alert">x</button>';
      this.errTmpl += '<%- msg %>';
      this.errTmpl += '</div>';
      this.errTmpl += '</div>';
      this.errTmpl = _.template(this.errTmpl);
    },
    events: {
      "focus .input-prepend input" : "removeErrMsg",
      "click .save-btn"            : "saveUser",
      "click .back-btn"            : "goBack"
    },
    render: function() {
      var tmpl;

      tmpl = this.template({ user: this.model.toJSON() });
      $(this.el).html(tmpl);

      return this;
    },
    goBack: function(e) {
      e.preventDefault();
      this.trigger('back');
    },
    saveUser: function(e) {
      var username, password, passwordrepeat, email, that;

      e.preventDefault();

      that = this;
      username = $.trim($('#username-input').val());
      password = $.trim($('#password-input').val());
      passwordrepeat = $.trim($('#passwordrepeat-input').val());
      if (password != passwordrepeat) {
          that.renderErrMsg('Passwords do not match.');
          return;
      }
      email = $.trim($('#email-input').val());
      rolesButtons = $("#roles-div [value='allow']input:radio:checked").toArray();
      roles = [];
      rolesButtons.forEach(function (r) {
        roles.push(r.name);
      });
      permsButtons = $("#perms-div [value='deny']input:radio:checked, #perms-div [value='allow']input:radio:checked").toArray();
      perms = [];
      permsButtons.forEach(function (p) {
          perms.push({id: p.name, allow: p.value === 'allow', deny: p.value === 'deny'});
      });

      this.model.save({
        username: username,
        email   : email,
        roles_id: roles,
        perms   : perms,
        password: password,
        pwr     : passwordrepeat
      }, {
        silent  : false,
        sync    : true,
        success : function(model, res) {
          if (res && res.errors) {
            that.renderErrMsg(res.errors);
          } else {
            model.trigger('save-success', model.get('_id'));
          }
        },
        error: function(model, res) {
          if (res && res.errors) {
            that.renderErrMsg(res.errors);
          } else if (res.status === 404) {
            // TODO: handle 404 Not Found
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
          }
        }
      });
    },
    renderErrMsg: function(err) {
      var msgs = [];

      this.removeErrMsg();

      if (_.isString(err)) {
        msgs.push(err);
      } else {
        if (err.general) {
          msgs.push(err.general);
          delete err.general;
        }
        if (_.keys(err).length) {
          msgs.push(_.keys(err).join(', ') + ' field(s) are invalid');
        }
      }
      msgs = _.map(msgs, function(string) {
        // uppercase first letter
        return string.charAt(0).toUpperCase() + string.slice(1);
      }).join('.');
      $(this.el).find('form').after(this.errTmpl({ msg: msgs }));
    },
    removeErrMsg: function() {
      $(this.el).find('.alert-error').remove();
    }
  });

  return UserEditView;
});
