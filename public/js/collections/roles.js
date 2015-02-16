define('RoleCollection', [
  'jquery',
  'underscore',
  'backbone',
  'RoleModel'
], function($, _, Backbone, RoleModel) {
  var RoleCollection;

  RoleCollection = Backbone.Collection.extend({
    model : RoleModel,
    url   : "api/v1/roles"
  });

  return RoleCollection;
});
