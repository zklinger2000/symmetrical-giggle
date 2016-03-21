'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Tbox = mongoose.model('Tbox'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an tbox
 */
exports.create = function (req, res) {
  var tbox = new Tbox(req.body);
  tbox.user = req.user;

  tbox.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tbox);
    }
  });
};

/**
 * Show the current tbox
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var tbox = req.tbox ? req.tbox.toJSON() : {};

  // Add a custom field to the Tbox, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Tbox model.
  tbox.isCurrentUserOwner = !!(req.user && tbox.user && tbox.user._id.toString() === req.user._id.toString());

  res.json(tbox);
};

/**
 * Update an tbox
 */
exports.update = function (req, res) {
  var tbox = req.tbox;

  tbox.title = req.body.title;
  tbox.content = req.body.content;

  tbox.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tbox);
    }
  });
};

/**
 * Delete an tbox
 */
exports.delete = function (req, res) {
  var tbox = req.tbox;

  tbox.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tbox);
    }
  });
};

/**
 * List of Tboxes
 */
exports.list = function (req, res) {
  Tbox.find().sort('-created').populate('user', 'displayName').exec(function (err, tboxes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tboxes);
    }
  });
};

/**
 * Tbox middleware
 */
exports.tboxByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tbox is invalid'
    });
  }

  Tbox.findById(id).populate('user', 'displayName').exec(function (err, tbox) {
    if (err) {
      return next(err);
    } else if (!tbox) {
      return res.status(404).send({
        message: 'No tbox with that identifier has been found'
      });
    }
    req.tbox = tbox;
    next();
  });
};
