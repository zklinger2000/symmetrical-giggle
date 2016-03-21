'use strict';

/**
 * Module dependencies
 */
var tboxesPolicy = require('../policies/tboxes.server.policy'),
  tboxes = require('../controllers/tboxes.server.controller');

module.exports = function (app) {
  // Tboxes collection routes
  app.route('/api/tboxes').all(tboxesPolicy.isAllowed)
    .get(tboxes.list)
    .post(tboxes.create);

  // Single tbox routes
  app.route('/api/tboxes/:tboxId').all(tboxesPolicy.isAllowed)
    .get(tboxes.read)
    .put(tboxes.update)
    .delete(tboxes.delete);

  // Finish by binding the tbox middleware
  app.param('tboxId', tboxes.tboxByID);
};
