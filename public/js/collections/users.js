define('UserCollection', [
  'jquery',
  'underscore',
  'backbone',
  'UserModel'
], function($, _, Backbone, User) {
  var UserCollection;

  UserCollection = Backbone.Collection.extend({
    model : User,
    url   : "api/v1/users"
  });

  return UserCollection;
});
