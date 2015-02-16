define('LoginView', [
    'jquery',
    'underscore',
    'backbone',
    'text!templates/login.html',
], function($, _, Backbone, tpl) {
    var LoginView;
    LoginView = Backbone.View.extend({
        initialize: function() {
            this.template = _.template(tpl);
        },
        events: {
            'click #login-btn'  : 'onLoginAttempt'
        },
        onLoginAttempt: function (evt) {
            if (evt) {
                evt.preventDefault();
            }
            var App = require('App');
            App.session.login({
                username: this.$('#login-username-input').val(),
                password: this.$('#login-password-input').val()
            }, {
                success: function(mod, res) {
                    console.log('SUCCESS', mod, res);
                },
                error: function(err) {
                    console.log('ERROR', err);
                    //App.showAlert('Bummer dude!', err.error, 'alert-danger');
                }
            });
        },
        render: function() {
            $(this.el).html(this.template());
            return this;
        }
    });

    return LoginView;
});
