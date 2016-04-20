'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
/**
 * Article Schema
 */
var ItemSchema = new Schema({
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
  category: {type: Schema.ObjectId,ref: 'Category'},
  // categoryId: {
  //   type: String,
  //   default: '',
  //   trim: true,
  // },
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
  image: {
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
  }
  // categoryId: {type: Schema.ObjectId,ref: 'Category'}
  // user: {
  //   type: Schema.ObjectId,
  //   ref: 'User'
  // }
});
ItemSchema.plugin(mongoosePaginate);
mongoose.model('Item', ItemSchema);
