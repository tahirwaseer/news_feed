'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    unique: true,
    required: 'Title cannot be blank'
  },
  category: {
    type: String,
    default: '',
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  link: {
    type: String,
    default: '',
    trim: true
  },
  isPermalink: {
    type: String,
    default: '',
    trim: true
  },
  guid: {
    type: String,
    default: '',
    trim: true
  },
  pubDate: {
    type: String,
    default: '',
    trim: true
  },
  // user: {
  //   type: Schema.ObjectId,
  //   ref: 'User'
  // }
});

mongoose.model('Article', ArticleSchema);
