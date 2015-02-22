define('App', [
    'jquery',
    'underscore',
    'backbone',
    'Router',
    'SessionModel',
    'bootstrap',
], function($, _, Backbone, Router, SessionModel) {
    var app = {
        root: '/',
        URL: '/',
        API: '/api/v1',
        initialize: function() {
            app.router = new Router();
            Backbone.history.start();
            app.session = new SessionModel({});
        },
        getRouter: function() {
            return this.router;
        },
        getSession: function() {
            return this.session;
        }
    };
  // TODO: error handling with window.onerror
  // http://www.slideshare.net/nzakas/enterprise-javascript-error-handling-presentation
    $.ajaxSetup({cache: false});
    app.eventAggregator = _.extend({}, Backbone.Events);
    return app;
});
