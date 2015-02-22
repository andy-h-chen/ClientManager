define('Router', [
    'jquery',
    'underscore',
    'backbone',
    'HomeView',
    'HeaderView',
    'LoginView',
    'ClientListView',
    'ClientView',
    'ClientEditView',
    'ClientModel',
    'UserListView',
    'UserView',
    'UserModel',
    'UserEditView',
    'PermissionListView',
    'PermissionCollection',
    'PermissionModel',
    'PermissionView',
    'PermEditView',
    'RoleListView',
    'RoleModel',
    'RoleView',
    'RoleEditView'
], function($, _, Backbone, HomeView, HeaderView, LoginView, ClientListView, ClientView, ClientEditView, Client, UserListView, UserView, User, UserEditView, PermissionListView, PermissionCollection, Permission, PermissionView, PermEditView, RoleListView, Role, RoleView, RoleEditView) {
    var AppRouter, initialize;

    AppRouter = Backbone.Router.extend({
        routes: {
            ''                  : 'home',
            'home'              : 'home',
            'login'             : 'login',
            'logout'            : 'logout',
            'clients'           : 'showClients', // /#/clients
            'clients/new'       : 'addClient',
            'clients/:id'       : 'showClient',
            'clients/:id/edit'  : 'editClient',
            'users'             : 'showUsers',
            'users/:id'         : 'showUser',
            'users/:id/edit'    : 'editUser',
            'perms'             : 'showPermissions',
            'perms/new'         : 'addPermission',
            'perms/:id'         : 'showPermission',
            'perms/:id/edit'    : 'editPermission',
            'roles'             : 'showRoles',
            'roles/new'         : 'addRole',
            'roles/:id'         : 'showRole',
            'roles/:id/edit'    : 'editRole',
            // any other action defaults to the following handler
            '*actions'          : 'defaultAction'
        },
    initialize: function() {
        this.clientView = {};
        this.clientEditView = {};
        this.headerView = new HeaderView();
        // cached elements
        this.elms = {
            'page-content': $('.page-content')
        };
        $('header').hide().html(this.headerView.render().el).fadeIn('slow');
        $('footer').fadeIn('slow');
    },
    getHeaderView: function () {
        return this.headerView;
    },
    home: function() {
        this.headerView.select('home-menu');

        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        this.elms['page-content'].html(this.homeView.render().el);
    },
    login: function() {
        this.headerView.select('login-menu');

        if (!this.loginView) {
            this.loginView = new LoginView();
        }
        this.elms['page-content'].html(this.loginView.renderLogin().el);
    },
    loginUserInfo: function() {
        if (!this.loginView) {
            this.loginView = new LoginView();
            return;
        }
        this.elms['page-content'].html(this.loginView.renderUserInfo().el);
    },
    logout: function() {
        this.loginView.logout();
    },
    showClients: function() {
        var that = this;

        this.headerView.select('list-menu');

        if (!this.clientListView) {
            this.clientListView = new ClientListView();
        }
        this.clientListView.render(function() {
            that.elms['page-content'].html(that.clientListView.el);
        });
    },
    showClient: function(id) {
      var that = this, view;

      this.headerView.select();

      // pass _silent to bypass validation to be able to fetch the model
      model = new Client({ _id: id, _silent: true });
      model.fetch({
        success : function(model) {
          model.unset('_silent');

          view = new ClientView({ model: model });
          that.elms['page-content'].html(view.render().el);
          view.model.on('delete-success', function() {
            delete view;
            that.navigate('clients', { trigger: true });
          });
        },
        error   : function(model, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
          }
        }
      });
    },
    addClient: function() {
      var that = this, model, view;

      this.headerView.select('new-menu');

      model = new Client();
      view  = new ClientEditView({ model: model });

      this.elms['page-content'].html(view.render().el);
      view.on('back', function() {
        delete view;
        that.navigate('#/clients', { trigger: true });
      });
      view.model.on('save-success', function(id) {
        delete view;
        that.navigate('#/clients/' + id, { trigger: true });
      });
    },
    editClient: function(id) {
      var that = this, model, view;

      this.headerView.select();

      // pass _silent to bypass validation to be able to fetch the model
      model = new Client({ _id: id, _silent: true });
      model.fetch({
        success : function(model) {
          model.unset('_silent');

          // Create & render view only after model has been fetched
          view = new ClientEditView({ model: model });
          that.elms['page-content'].html(view.render().el);
          view.on('back', function() {
            delete view;
            that.navigate('#/clients/' + id, { trigger: true });
          });
          view.model.on('save-success', function() {
            delete view;
            that.navigate('#/clients/' + id, { trigger: true });
          });
        },
        error   : function(model, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
          }
        }
      });

    },
    showUsers: function() {
        var that = this;

        this.headerView.select('listuser-menu');

        if (!this.userListView) {
            this.userListView = new UserListView();
        }
        this.userListView.render(function() {
            that.elms['page-content'].html(that.userListView.el);
        });
    },
    showUser: function(id) {
        var that = this, view;

        this.headerView.select();

        // pass _silent to bypass validation to be able to fetch the model
        model = new User({ _id: id, _silent: true });
        model.fetch({
            success : function(model) {
                model.unset('_silent');

                view = new UserView({ model: model });
                that.elms['page-content'].html(view.render().el);
                view.model.on('delete-success', function() {
                    delete view;
                    that.navigate('users', { trigger: true });
                });
            },
            error   : function(model, res) {
                if (res.status === 404) {
                    // TODO: handle 404 Not Found
                } else if (res.status === 500) {
                    // TODO: handle 500 Internal Server Error
                }
            }
        });
    },
    editUser: function(id) {
      var that = this, model, view;

      this.headerView.select();

      // pass _silent to bypass validation to be able to fetch the model
      model = new User({ _id: id, _silent: true });
      model.fetch({
        success : function(model) {
          model.unset('_silent');

          // Create & render view only after model has been fetched
          view = new UserEditView({ model: model });
          that.elms['page-content'].html(view.render().el);
          view.on('back', function() {
            delete view;
            that.navigate('#/users/' + id, { trigger: true });
          });
          view.model.on('save-success', function() {
            delete view;
            that.navigate('#/users/' + id, { trigger: true });
          });
        },
        error   : function(model, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
          }
        }
      });

    },
    showPermissions: function() {
        var that = this;

        this.headerView.select('listperm-menu');

        if (!this.permListView) {
            this.permListView = new PermissionListView();
        }
        this.permListView.render(function() {
            that.elms['page-content'].html(that.permListView.el);
        });
    },

    showPermission: function(id) {
        var that = this, view;

        this.headerView.select();

        // pass _silent to bypass validation to be able to fetch the model
        model = new Permission({ _id: id, _silent: true });
        model.fetch({
            success : function(model) {
                model.unset('_silent');

                view = new PermissionView({ model: model });
                that.elms['page-content'].html(view.render().el);
                view.model.on('delete-success', function() {
                    delete view;
                    that.navigate('perms', { trigger: true });
                });
            },
            error   : function(model, res) {
                if (res.status === 404) {
                    // TODO: handle 404 Not Found
                } else if (res.status === 500) {
                    // TODO: handle 500 Internal Server Error
                }
            }
        });
    },
    editPermission: function(id) {
        var that = this, model, view;

        this.headerView.select();

        // pass _silent to bypass validation to be able to fetch the model
        model = new Permission({ _id: id, _silent: true });
        model.fetch({
            success : function(model) {
                model.unset('_silent');

                // Create & render view only after model has been fetched
                view = new PermEditView({ model: model });
                that.elms['page-content'].html(view.render().el);
                view.on('back', function() {
                    delete view;
                    that.navigate('#/perms/' + id, { trigger: true });
                });
                view.model.on('save-success', function() {
                    delete view;
                    that.navigate('#/perms/' + id, { trigger: true });
                });
            },
            error: function(model, res) {
                if (res.status === 404) {
                    // TODO: handle 404 Not Found
                } else if (res.status === 500) {
                    // TODO: handle 500 Internal Server Error
                }
            }
        });
    },
    addPermission: function() {
        var that = this, model, view;

        model = new Permission();
        view  = new PermEditView({ model: model });

        this.elms['page-content'].html(view.render().el);
        view.on('back', function() {
            delete view;
            that.navigate('#/perms', { trigger: true });
        });
        view.model.on('save-success', function(id) {
            delete view;
            that.navigate('#/perms/' + id, { trigger: true });
        });
    },

    showRoles: function() {
        var that = this;

        this.headerView.select('listrole-menu');

        if (!this.roleListView) {
            this.roleListView = new RoleListView();
        }
        this.roleListView.render(function() {
            that.elms['page-content'].html(that.roleListView.el);
        });
    },

    showRole: function(id) {
        var that = this, view;

        this.headerView.select();

        // pass _silent to bypass validation to be able to fetch the model
        model = new Role({ _id: id, _silent: true });
        model.fetch({
            success : function(model) {
                model.unset('_silent');

                view = new RoleView({ model: model });
                that.elms['page-content'].html(view.render().el);
                view.model.on('delete-success', function() {
                    delete view;
                    that.navigate('roles', { trigger: true });
                });
            },
            error   : function(model, res) {
                if (res.status === 404) {
                    // TODO: handle 404 Not Found
                } else if (res.status === 500) {
                    // TODO: handle 500 Internal Server Error
                }
            }
        });
    },
    editRole: function(id) {
        var that = this, model, view;

        this.headerView.select();

        // pass _silent to bypass validation to be able to fetch the model
        model = new Role({ _id: id, _silent: true });
        model.fetch({
            success : function(model) {
                model.unset('_silent');

                // Create & render view only after model has been fetched
                view = new RoleEditView({ model: model });
                that.elms['page-content'].html(view.render().el);
                view.on('back', function() {
                    delete view;
                    that.navigate('#/roles/' + id, { trigger: true });
                });
                view.model.on('save-success', function() {
                    delete view;
                    that.navigate('#/roles/' + id, { trigger: true });
                });
            },
            error: function(model, res) {
                if (res.status === 404) {
                    // TODO: handle 404 Not Found
                } else if (res.status === 500) {
                    // TODO: handle 500 Internal Server Error
                }
            }
        });
    },

    addRole: function() {
        var that = this, model, view;
        that.permissions = new PermissionCollection();
        this.permissions.fetch({
            success: function(collection) {
                model = new Role({perms: collection.toJSON()});
                view  = new RoleEditView({ model: model });
                that.elms['page-content'].html(view.render().el);
                view.on('back', function() {
                    delete view;
                    that.navigate('#/roles', { trigger: true });
                });
                view.model.on('save-success', function(id) {
                    delete view;
                    that.navigate('#/roles/' + id, { trigger: true });
                });
            },
            error: function(coll, res) {
                if (res.status === 404) {
                    // TODO: handle 404 Not Found
                } else if (res.status === 500) {
                    // TODO: handle 500 Internal Server Error
                }
            }
        });
    },
    defaultAction: function(actions) {
      // No matching route, log the route?
    }
  });

  return AppRouter;
});
