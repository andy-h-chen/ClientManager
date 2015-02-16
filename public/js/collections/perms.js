define('PermissionCollection', [
  'jquery',
  'underscore',
  'backbone',
  'PermissionModel'
], function($, _, Backbone, PermissionModel) {
  var PermissionCollection;

  PermissionCollection = Backbone.Collection.extend({
    model : PermissionModel,
    url   : "api/v1/perms"
  });

  return PermissionCollection;
});
