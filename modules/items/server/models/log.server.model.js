'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */


var LogSchema = new Schema({


  userId: {
    type: String,
    default: '',
    trim: true,
  },
  itemId: {
    type: String,
    default: '',
    trim: true,
  },

  time: {
    type: Date,
    default: Date.now
  }
 
 
  // user: {
  //   type: Schema.ObjectId,
  //   ref: 'User'
  // }
});

mongoose.model('Log', LogSchema);
