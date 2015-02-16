define('PermissionModel', [
    'App',
    'underscore',
    'backbone'
], function(App, _, Backbone) {
    var PermissionModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot: "/api/v1/perms",
        initialize: function() {
            _.bindAll(this, 'url');
        },
        defaults: {
            id: 0,
            name: '',
            key: ''
        }
    });
    return PermissionModel;
});
