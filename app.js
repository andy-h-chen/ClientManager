var connect        = require('connect'),
    express        = require('express'),
    connectTimeout = require('connect-timeout'),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    gzippo         = require('gzippo'),
    utils          = require('./lib/utils'),
    EventEmitter   = require('events').EventEmitter,
    AppEmitter     = new EventEmitter(),
    app            = express.createServer(),
    ENV            = process.env.NODE_ENV || 'development',
    log            = console.log;

app.v1 = '/api/v1';
app.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.json({error: 'Please login.'});
}

utils.loadConfig(__dirname + '/config', function(config) {
    app.use(function(req, res, next) {
        res.removeHeader("X-Powered-By");
        next();
    });
    app.configure(function() {
        utils.ifEnv('production', function() {
            // enable gzip compression
            app.use(gzippo.compress());
        });
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express['static'](__dirname + '/public'));
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.session({secret: 'cdpg', cookie: {maxAge: null}}));
        app.use(passport.initialize());
        app.use(passport.session());
        utils.ifEnv('production', function() {
            app.use(connectTimeout({
                time: parseInt(config[ENV].REQ_TIMEOUT, 10)
            }));
        });
    });

    app.use(function(err, req, res, next) {
        if (err && err.stack) {
            console.log(err.stack);
        }
        next();
    });

    mongoose = utils.connectToDatabase(mongoose, config.db[ENV].main);

    // register models
    require('./app/models/client')(mongoose);
    require('./app/models/permission')(mongoose);
    require('./app/models/role')(mongoose);
    require('./app/models/user')(mongoose);

    // register controllers
    require('./app/controllers/clients_controller')(app, mongoose, config);
    require('./app/controllers/auth_controller')(app, mongoose, passport, config);
    require('./app/controllers/perms_controller')(app, mongoose, config);
    require('./app/controllers/roles_controller')(app, mongoose, config);
    require('./app/controllers/users_controller')(app, mongoose, config);
    require('./app/controllers/errors_controller')(app, mongoose, config);

    app.on('error', function (e) {
        if (e.code == 'EADDRINUSE') {
            log('Address in use, retrying...');
            setTimeout(function () {
                app.close();
                app.listen(config[ENV].PORT, function() {
                    app.serverUp = true;
                });
            }, 1000);
        }
    });

    if (!module.parent) {
        app.listen(config[ENV].PORT, function() {
            app.serverUp = true;
        });
        log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env);
    }

    AppEmitter.on('checkApp', function() {
        AppEmitter.emit('getApp', app);
    });

});

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

/**
 * export AppEmitter for external services so that the callback can execute
 * when the app has finished loading the configuration
 */
module.exports = AppEmitter;
