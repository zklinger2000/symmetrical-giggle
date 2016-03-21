'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tbox Schema
 */
var TboxSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    default: '',
    trim: true,
    required: 'Category cannot be blank'
  },
  size: {
    type: Number,
    default: 1,
    required: 'Size cannot be blank'
  },
  count: {
    type: Number,
    default: 1,
    required: 'Size cannot be blank'
  },
  unit: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Tbox', TboxSchema);
