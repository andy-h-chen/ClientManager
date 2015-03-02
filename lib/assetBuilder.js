var async  = require('async'),
    cssMin = require('./cssmin'),
    fs        = require('fs'),
    requirejs = require('requirejs'),
    jsConfig, cssConfig, filePaths, actionsLeft, assetBuilder;

actionsLeft = 2;

jsConfig = {
  baseUrl : __dirname + '/../public/js',
  name    : 'main',
  out     : __dirname + '/../public/build/main-built.js',
  paths: {
    'text'                  : 'lib/text',
    'jquery'                : 'lib/jquery',
    'underscore'            : 'lib/underscore',
    'backbone'              : 'lib/backbone-amd',
    'bootstrap'             : 'lib/bootstrap',
    'moment'                : 'lib/moment',
    'ClientModel'           : 'models/client',
    'ClientCollection'      : 'collections/clients',
    'SessionModel'          : 'models/session',
    'UserModel'             : 'models/user',
    'UserCollection'        : 'collections/users',
    'HomeView'              : 'views/home',
    'LoginView'             : 'views/login',
    'HeaderView'            : 'views/header',
    'ClientListView'        : 'views/clients/index',
    'ClientEditView'        : 'views/clients/edit',
    'ClientView'            : 'views/clients/show',
    'UserListView'          : 'views/users/index',
    'UserView'              : 'views/users/show',
    'UserEditView'          : 'views/users/edit',
    'PermissionModel'       : 'models/perm',
    'PermissionCollection'  : 'collections/perms',
    'PermissionListView'    : 'views/perms/index',
    'PermissionView'        : 'views/perms/show',
    'PermEditView'          : 'views/perms/edit',
    'RoleModel'             : 'models/role',
    'RoleCollection'        : 'collections/roles',
    'RoleListView'          : 'views/roles/index',
    'RoleView'              : 'views/roles/show',
    'RoleEditView'          : 'views/roles/edit'
  },
  optimize: 'none'
};

// cssConfig a la RequireJS optimizer
cssConfig = {
  baseUrl : '../public/css',
  files   : ['../node_modules/bootstrap/dist/css/bootstrap.min', '../public/css/style'],
  out     : '../public/build/main-built.css'
};

assetBuilder = function(callback) {
    // bootstrap
    fs.createReadStream(__dirname + '/../node_modules/bootstrap/dist/js/bootstrap.min.js').pipe(fs.createWriteStream(__dirname + '/../public/js/lib/bootstrap.min.js'));
    // jquery
    fs.createReadStream(__dirname + '/../node_modules/jquery/dist/jquery.min.js').pipe(fs.createWriteStream(__dirname + '/../public/js/lib/jquery.min.js'));


  requirejs.optimize(jsConfig, function (buildResponse) {
    // buildResponse is just a text output of the modules
    // included. Load the built file for the contents.
    // Use config.out to get the optimized file contents.
    //var contents = fs.readFileSync(jsConfig.out, 'utf8');
    //console.log(contents);
    if (!--actionsLeft) {
      callback();
    }
  });

  // construct the file paths
  filePaths = [];
  cssConfig.files.forEach(function(file) {
    //filePaths.push(__dirname + '/' + cssConfig.baseUrl + '/' + file + '.css');
    filePaths.push(__dirname + '/' + file + '.css');
  });

  async.map(filePaths, function minimizeCss(item, callback) {
    fs.readFile(item, 'UTF-8', function(err, contents) {
      if (err) {
        callback(err, null);
      } else {
        // return minified contents
        callback(null, cssMin(contents));
      }
    });
  }, function writeToFile(err, results) {
    var filePath;

    if (err) { throw err; }

    filePath = __dirname + '/' + cssConfig.out;
    fs.writeFile(filePath, results.join('\n'), 'UTF-8', function(err) {
      if (err) { throw err; }

      // execute callback only when both actions have finished
      if (!--actionsLeft) {
        callback();
      }
    });
  });

};

module.exports = assetBuilder;
