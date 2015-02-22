var v1       = '/api/v1',
    utils    = require('../../lib/utils'),
    _        = require('underscore'),
    NotFound = utils.NotFound,
    checkErr = utils.checkErr,
    log      = console.log,
    UsersController;

UsersController = function(app, mongoose, config) {

    var User = mongoose.model('User');

    app.get(v1 + '/users', app.ensureAuthenticated, function index(req, res, next) {
        console.log(req.url, req.query);
    
        User.search({query: req.query, fields:{username:1, email:1}}, function(err, users) {
            checkErr(
                next,
                [{ cond: err }],
                function() {
                    // TODO: finish etag support here, check for If-None-Match
                    res.header('ETag', utils.etag(users));
                    res.json(users);
                }
            );
        });
    });

    app.get(v1 + '/users/:id', app.ensureAuthenticated, function show(req, res, next) {
        User.findById(req.params.id, true, function(err, user) {
            checkErr(
                next,
                [{ cond: err }, { cond: !user, err: new NotFound('json') }],
                function() {
                    // TODO: finish etag support here, check for If-None-Match
                    res.header('ETag', utils.etag(user));
                    res.json(user);
                }
            );
        });
    });
    app.put(app.v1 + '/users/:id', app.ensureAuthenticated, function update(req, res, next) {
        User.findById(req.params.id, false /* details */, function(err, user) {
            checkErr(
                next,
                [{ cond: err }, { cond: !user, err: new NotFound('json') }],
                function() {
                    var newAttributes;

                    // modify resource with allowed attributes
                    newAttributes = _.pick(req.body, 'email', 'roles_id', 'perms');
                    user = _.extend(user, newAttributes);

                    user.calculateAllPerms(user, function(err, u) {
                        if (err) {
                             errors = utils.parseDbErrors(err, config.error_messages);
                             if (errors.code) {
                                 code = errors.code;
                                 delete errors.code;
                                 log(err);
                             }
                             res.json(errors, code);
                             return;
                        }
                        u.save(function(err) {
                            var errors, code = 200;

                            if (!err) {
                                // send 204 No Content
                                res.send();
                            } else {
                                errors = utils.parseDbErrors(err, config.error_messages);
                                if (errors.code) {
                                    code = errors.code;
                                    delete errors.code;
                                    log(err);
                                }
                                res.json(errors, code);
                            }
                        });
                    });
                }
            );
        });
    });
/*
  app.post(v1 + '/clients', function create(req, res, next) {
    log('app.post', req.url);
    var newClient;

    // disallow other fields besides those listed below
    newClient = new Client(_.pick(req.body, 'name', 'email', 'born', 'company'));
    newClient.save(function(err) {
      var errors, code = 200, loc;

      if (!err) {
        loc = config.site_url + v1 + '/clients/' + newClient._id;
        res.setHeader('Location', loc);
        res.json(newClient, 201);
      } else {
        errors = utils.parseDbErrors(err, config.error_messages);
        if (errors.code) {
          code = errors.code;
          delete errors.code;
          // TODO: better better logging system
          log(err);
        }
        res.json(errors, code);
      }
    });
  });

  app.put(v1 + '/clients/:id', function update(req, res, next) {
    Client.findById(req.params.id, function(err, client) {
      checkErr(
        next,
        [{ cond: err }, { cond: !client, err: new NotFound('json') }],
        function() {
          var newAttributes;

          // modify resource with allowed attributes
          newAttributes = _.pick(req.body, 'name', 'email', 'born', 'company');
          client = _.extend(client, newAttributes);

          client.save(function(err) {
            var errors, code = 200;

            if (!err) {
              // send 204 No Content
              res.send();
            } else {
              errors = utils.parseDbErrors(err, config.error_messages);
              if (errors.code) {
                code = errors.code;
                delete errors.code;
                log(err);
              }
              res.json(errors, code);
            }
          });
        }
      );
    });
  });

  app.del(v1 + '/clients/:id', function destroy(req, res, next) {
    Client.findById(req.params.id, function(err, client) {
      checkErr(
        next,
        [{ cond: err }, { cond: !client, err: new NotFound('json') }],
        function() {
          client.remove();
          res.json({});
        }
      );
    });
  });
*/
};

module.exports = UsersController;
