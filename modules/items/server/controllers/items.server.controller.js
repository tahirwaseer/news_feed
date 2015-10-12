'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Item = mongoose.model('Item'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var parseString = require('xml2js').parseString;
var https = require('https');
/**
 * Create a item
 */
exports.create = function (req, res) {
  var item = new Item(req.body);
  item.user = req.user;

  item.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};

/**
 * Show the current item
 */
exports.read = function (req, res) {
  res.json(req.item);
};

/**
 * Update a item
 */
exports.update = function (req, res) {
  var item = req.item;

  item.title = req.body.title;
  item.content = req.body.content;

  item.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};

/**
 * Delete an item
 */
exports.delete = function (req, res) {
  var item = req.item;

  item.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};

/**
 * List of Items
 */
exports.list = function (req, res) {
  Item.find().sort('-created').populate( 'displayName').exec(function (err, items) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(items);
    }
  });
};

/**
 * Item middleware
 */
exports.itemByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Item is invalid'
    });
  }

  Item.findById(id).populate('user', 'displayName').exec(function (err, item) {
    if (err) {
      return next(err);
    } else if (!item) {
      return res.status(404).send({
        message: 'No item with that identifier has been found'
      });
    }
    req.item = item;
    next();
  });
};

function xmlToJson(url, callback) {
  var req = https.get(url, function(res) {
    var xml = '';
    
    res.on('data', function(chunk) {
      xml += chunk;
    });

    res.on('error', function(e) {
      callback(e, null);
    }); 

    res.on('timeout', function(e) {
      callback(e, null);
    }); 

    res.on('end', function() {
      parseString(xml, function(err, result) {
        callback(null, result);
      });
    });
  });
}

exports.import = function (req, res) {
  var url = req.query.url;

  xmlToJson(url, function(err, data) {
    if (err) {
      // Handle this however you like
      return console.err(err);
    }
    var json_string = JSON.stringify(data, null, 2);
    var import_data = JSON.parse(json_string);
    var items = import_data.rss.channel[0].item;
    var arr = [];
      for (var i = items.length - 1; i >= 0; i--) {
        var item = new Item({
          title: items[i].title[0],
          category: import_data.rss.channel[0].description[0],
          description: items[i].description[0],
          link: items[i].link,
          isPermalink: items[i].guid.$,
          guid: items[i].guid[0]._,
          pubDate: items[i].pubDate[0] 
        });
        item.save();
      }  
    // Do whatever you want with the data here
    // Following just pretty-prints the object
    // console.log(import_data.rss.channel[0].item[0].pubDate[0]);
    res.json('Succesfully imported');
  });
  // item.title = req.body.title;
  // item.content = req.body.content;

  // item.save(function (err) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(item);
  //   }
  // });
};
