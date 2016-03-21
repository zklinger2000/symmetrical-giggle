(function (app) {
  'use strict';

  app.registerModule('tboxes', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('tboxes.services');
  app.registerModule('tboxes.routes', ['ui.router', 'tboxes.services']);
}(ApplicationConfiguration));
