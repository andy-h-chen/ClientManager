var v1       = '/api/v1',
    utils    = require('../../lib/utils'),
    _        = require('underscore'),
    LocalStrategy  = require('passport-local').Strategy,
    NotFound = utils.NotFound,
    checkErr = utils.checkErr,
    log      = console.log,
    AuthController;

AuthController = function(app, mongoose, passport, config) {
    var User = mongoose.model('User');
    passport.use(new LocalStrategy(
        function(username, password, done) {
            process.nextTick(function() {
                User.findByUsername(username, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {message: 'Unknown user' + username});
                    }
                    if (user.password != password) {
                        return done(null, false, {message: 'Invalid password'});
                    }
                    return done(null, user);
                })
            });
        }
    ));

    // Passport setup
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, false, function(err, user) {
            done(err, user);
        });
    });

    app.post(v1 + '/auth/login', function(req, res, next) {
        log(req.url);
        log(req.body.username, req.body.password);
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                res.json({error: 'Username does not exist.'});
                return;
            }
            req.logIn(user, function(err) {
                if (err) {
                    res.json({error: err});
                } else {
                    res.json({user: user});
                }
            });
        })(req, res, next);
    });

    app.post(v1 + '/auth/logout', app.ensureAuthenticated, function(req, res, next) {
        console.log('logout', req.isAuthenticated());
        if (req.isAuthenticated()) {
            req.logout();
            req.session.destroy();
            console.log(req.isAuthenticated());
            res.json({});
            //req.session.messages = req.i18n.__("Log out successfully.");
        } else {
            res.json({error: 'Please log in.'});
        }
    });
};

module.exports = AuthController;
