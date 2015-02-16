define('UserModel', [
    'App',
    'underscore',
    'backbone'
], function(App, _, Backbone) {
    var UserModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot: "/api/v1/users",
        initialize: function() {
            _.bindAll(this, 'url');
        },
        defaults: {
            id: 0,
            username: '',
            name: '',
            email: ''
        }
    });
    return UserModel;
});
