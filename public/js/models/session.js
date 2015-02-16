define('SessionModel', [
    'App',
    'UserModel',
    'underscore',
    'jquery',
    'backbone'
], function (App, UserModel, _, $, Backbone) {
    var SessionModel = Backbone.Model.extend({
        defaults: {
            logged_in: false,
            user_id: ''
        },
        initialize: function() {
            _.bindAll(this, 'checkAuth', 'postAuth', 'login', 'logout', 'url');
            this.user = new UserModel({});
        },
        url: function() {
            return App.API + '/auth';
        },
        updateSessionUser: function(userData) {
            this.user.set(_.pick(userData, _.keys(this.user.defaults)));
        },
        checkAuth: function(callback, args) {
            var self = this;
            this.fetch({
                success: function(mod, res) {
                    if (!res.error && res.user) {
                        self.updateSessionUser(res.user);
                        self.set({logged_in: true});
                        if ('success' in callback) {
                            callback.success(mod, user);
                        }
                    } else {
                        self.set({logged_in: false});
                        if ('error' in callback) {
                            callback.error(mod, res);
                        }
                    }
                },
                error: function(mod, res) {
                    self.set({logged_in: false});
                    if ('error' in callback) {
                        callback.error(mod, res);
                    }
                }
            }).complete(function() {
                if ('complete' in callback) {
                    callback.complete();
                }
            });
        },
        postAuth: function(opts, callback, args) {
            var self = this;
            var postData = _.omit(opts, 'method');
            $.ajax({
                url: this.url() + '/' + opts.method,
                contentType: 'application/json',
                dataType: 'json',
                type: 'POST',
                beforeSend: function(xhr) {
                    var token = $('meta[name="csrf-token"]').attr('content');
                    if (token) {
                        xhr.setRequestHeader('X-CSRF-Token', token);
                    }
                },
                data: JSON.stringify(_.omit(opts, 'method')),
                success: function(res) {
                    if (!res.error) {
                        if (_.indexOf(['login', 'signup'], opts.method) !== -1) {
                            self.updateSessionUser(res.user || {});
                            self.set({user_id: res.user.id, logged_in: true});
                        } else {
                            self.set({logged_in: false});
                        }
                        if(callback && 'success' in callback) callback.success(res);
                    } else {
                        if(callback && 'error' in callback) callback.error(res);
                    }
                },
                error: function(mod, res) {
                    if(callback && 'error' in callback) callback.error(res);
                }
            }).complete(function() {
                if(callback && 'complete' in callback) callback.complete(res);
            });
        },
        login: function(opts, callback, args) {
            this.postAuth(_.extend(opts, {method: 'login'}), callback);
        },
        logout: function(opts, callback, args) {
            this.postAuth(_.extend(opts, {method: 'logout'}), callback);
        },
    });
    return SessionModel;
});
