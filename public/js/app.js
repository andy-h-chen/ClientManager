define('App', [
    'jquery',
    'underscore',
    'backbone',
    'Router',
    'bootstrap',
], function($, _, Backbone, Router) {
    var app = {
        root: '/',
        URL: '/',
        API: '/api/v1',
        initialize: function() {
            app.router = new Router();
            Backbone.history.start();
        }
    };
  // TODO: error handling with window.onerror
  // http://www.slideshare.net/nzakas/enterprise-javascript-error-handling-presentation
    $.ajaxSetup({cache: false});
    app.eventAggregator = _.extend({}, Backbone.Events);
    return app;
});
