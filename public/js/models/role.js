define('RoleModel', [
    'App',
    'underscore',
    'backbone'
], function(App, _, Backbone) {
    var RoleModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot: "/api/v1/roles",
        initialize: function() {
            _.bindAll(this, 'url');
        },
        defaults: {
            id: 0,
            name: '',
        }
    });
    return RoleModel;
});
