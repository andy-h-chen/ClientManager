define('LoginView', [
    'jquery',
    'underscore',
    'backbone',
    'text!templates/login.html',
    'text!templates/userinfo.html'
], function($, _, Backbone, tplLogin, tplUserInfo) {
    var LoginView;
    LoginView = Backbone.View.extend({
        initialize: function() {
            this.templateLogin = _.template(tplLogin);
            this.templateUserInfo = _.template(tplUserInfo);
        },
        events: {
            'click #login-btn'  : 'onLoginAttempt'
        },
        onLoginAttempt: function (evt) {
            var that = this;
            if (evt) {
                evt.preventDefault();
            }
            var App = require('App');
            App.getSession().login({
                username: this.$('#login-username-input').val(),
                password: this.$('#login-password-input').val()
            }, {
                success: function(mod, res) {
                    console.log('SUCCESS', mod, res);
                    that.user = mod.user;
                    var router = App.getRouter();
                    var header = router.getHeaderView();
                    header.updateLoginStatus('Logout');
                    router.navigate('#', { trigger: true });
                    router.loginUserInfo();
                },
                error: function(err) {
                    console.log('ERROR', err);
                    //App.showAlert('Bummer dude!', err.error, 'alert-danger');
                }
            });
        },
        logout: function() {
            var App = require('App');
            App.getSession().logout({}, {
                success: function(mod, res) {
                    console.log('Logout success');
                    var router = App.getRouter();
                    var header = router.getHeaderView();
                    header.updateLoginStatus('Login');
                    router.login();
                },
                error: function(err) {
                    console.log('ERROR', err);
                }
            });
        },
        renderLogin: function() {
            $(this.el).html(this.templateLogin());
            return this;
        },
        renderUserInfo: function() {
            $(this.el).html(this.templateUserInfo({user: this.user}));
            return this;
        }
    });

    return LoginView;
});
