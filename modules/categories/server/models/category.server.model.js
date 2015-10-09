'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var CategorySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  
  link: {
    type: String,
    default: '',
    trim: true
  }
  
  // user: {
  //   type: Schema.ObjectId,
  //   ref: 'User'
  // }
});

mongoose.model('Category', CategorySchema);
