requirejs.config({
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'bootstrap': {
      deps: ['jquery'],
      exports: 'bootstrap'
    }
  },
  /**
   * HACK:
   * Modified Underscore and Backbone to be AMD compatible (define themselves)
   * since it didn't work properly with the RequireJS shim when optimizing
   */
  paths: {
    'text'             : 'lib/text',
    'jquery'           : 'lib/jquery',
    'underscore'       : 'lib/underscore',
    'backbone'         : 'lib/backbone-amd',
    'bootstrap'        : 'lib/bootstrap',
    'moment'           : 'lib/moment',
    'Mediator'         : 'lib/mediator',
    'App'              : 'app',
    'Router'           : 'router',
    'ClientModel'      : 'models/client',
    'ClientCollection' : 'collections/clients',
    'SessionModel'     : 'models/session',
    'UserModel'        : 'models/user',
    'UserCollection'   : 'collections/users',
    'HomeView'         : 'views/home',
    'LoginView'        : 'views/login',
    'HeaderView'       : 'views/header',
    'ClientListView'   : 'views/clients/index',
    'ClientEditView'   : 'views/clients/edit',
    'ClientView'       : 'views/clients/show',
    'UserListView'     : 'views/users/index',
    'UserView'         : 'views/users/show'
  }
});

require([
    'App',
    'SessionModel'
], function(App, SessionModel, Client) {
    App.initialize();
    App.session = new SessionModel({});
});
