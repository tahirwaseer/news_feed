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
  },
  sourceImage: {
    type: String,
    default: '',
    trim: true
  },
  sourceName: {
    type: String,
    default: '',
    trim: true
  },
  // items: [{type: Schema.Types.ObjectId,ref: 'Item'}]
  // user: {
  //   type: Schema.ObjectId,
  //   ref: 'User'
  // }
});
CategorySchema.plugin(mongoosePaginate);

mongoose.model('Category', CategorySchema);
