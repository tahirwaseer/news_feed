'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  fs = require('fs'),
  url = require('url'),
  mongoose = require('mongoose'),
  Category = mongoose.model('Category'),
  Item = mongoose.model('Item'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a article
 */
// exports.create = function (req, res) {
//   var category = new Category(req.body);
//   category.user = req.user;

//   category.save(function (err) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.json(category);
//     }
//   });
// };
function checkDirectorySync(directory) {  
  try {
    fs.statSync(directory);
  } catch(e) {
    fs.mkdirSync(directory);
  }
}
exports.create = function (req, res) {
  var category = new Category(req.body);
  var baseUrl = url.format({
                  protocol: req.protocol,
                  host: req.get('host'),
                });
  if (Object.keys(req.files).length > 0) {
    var dir = './modules/categories/client/img/uploads/';
    checkDirectorySync('./modules/categories/client/img/');
    checkDirectorySync(dir);
    fs.writeFile(dir + req.files.sourceImage.name, req.files.sourceImage.buffer, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading news source picture'
        });
      } else {
        category.sourceImage = baseUrl+'/modules/categories/client/img/uploads/'+ req.files.sourceImage.name;
        category.title = req.body.title;
        category.sourceName = req.body.sourceName;
        category.content = req.body.content;

        // item.image = req.body.image;
        category.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(category);
          }
        });
      }
    });
  } else {
    category.sourceImage = '';
    category.title = req.body.title;
    category.sourceName = req.body.sourceName;
    category.content = req.body.content;
    category.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(category);
      }
    });
  }  
};
/**
 * Show the current article
 */
exports.read = function (req, res) {
  res.json(req.category);
};

/**
 * Update a article
 */
// exports.update = function (req, res) {
//   var category = req.category;

//   category.title = req.body.title;
//   category.content = req.body.content;

//   category.save(function (err) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.json(category);
//     }
//   });
// };


exports.update = function (req, res) {
  var category = req.category;
  console.log(Object.keys(req.files).length > 0);
  console.log(req.files);
  // console.log(req.files.image.name);
  // console.log(req);
  var baseUrl = url.format({
                  protocol: req.protocol,
                  host: req.get('host'),
                });
  if (Object.keys(req.files).length > 0) {
    var dir = './modules/categories/client/img/uploads/';
    checkDirectorySync('./modules/categories/client/img/');
    checkDirectorySync(dir);
    fs.writeFile(dir + req.files.sourceImage.name, req.files.sourceImage.buffer, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading news source picture'
        });
      } else {
        category.sourceImage = baseUrl+'/modules/categories/client/img/uploads/'+ req.files.sourceImage.name;
        category.title = req.body.title;
        category.sourceName = req.body.sourceName;
        category.content = req.body.content;

        // item.image = req.body.image;
        category.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(category);
          }
        });
      }
    });
  } else {
    category.sourceImage = category.sourceImage;
    category.title = req.body.title;
    category.sourceName = req.body.sourceName;
    category.content = req.body.content;
    category.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(category);
      }
    });
  }  
};

exports.serveImage = function (req, res){
  var img = fs.readFileSync('./modules/categories/client/img/uploads/'+req.params.image_name);
     res.writeHead(200, {'Content-Type': 'image/gif' });
     res.end(img);
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var category = req.category;

  category.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(category);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  Category.find().sort('-created').populate( 'displayName').exec(function (err, categories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(categories);
    }
  });
};

exports.items = function(req,res){
  var limit = Math.abs(req.query.limit) || 10; var page = (Math.abs(req.query.page) || 1) - 1;
  Item.paginate({category: req.category._id}, { offset: limit*page, limit: limit,populate: 'category' }, function(err, result) {
      // result.docs
      // result.total
      // result.limit - 10
      // result.offset - 20  if (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      
      var items = result.docs;
      var data=[];
      // var category = req.category;
      // for (var i = 0, len = items.length; i < len; i++) {
      //   var data_item={};
      //   if (category) {
      //   data_item={_id: items[i]._id, sourceName: category.sourceName, sourceImage: category.sourceImage, title: items[i].title, description: items[i].description,
      //     link: items[i].link, isPermalink: items[i].isPermalink, guid: items[i].guid, pubDate: items[i].pubDate, category: items[i].category, categoryId: items[i].categoryId};
      //   data[i]=data_item;
      //   }; 
      // }
      // result.docs = data;
      res.json(result);      
    }
  });
};
/**
 * Article middleware
 */
exports.categoryByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'category is invalid'
    });
  }

  Category.findById(id).populate('user', 'displayName').exec(function (err, category) {
    if (err) {
      return next(err);
    } else if (!category) {
      return res.status(404).send({
        message: 'No category with that identifier has been found'
      });
    }
    req.category = category;
    next();
  });
};
// // exports.import = function (req, res) {
// //   var article = req.article;

// //   article.title = req.body.title;
// //   article.content = req.body.content;

// //   article.save(function (err) {
// //     if (err) {
// //       return res.status(400).send({
// //         message: errorHandler.getErrorMessage(err)
// //       });
// //     } else {
// //       res.json(article);
// //     }
// //   });
// };