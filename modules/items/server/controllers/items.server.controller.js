// 'use strict';
var arr = {};
/**
 * Module dependencies.
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  Item = mongoose.model('Item'),
  Log = mongoose.model('Log'),
  User = mongoose.model('User'),
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
function checkDirectorySync(directory) {  
  try {
    fs.statSync(directory);
  } catch(e) {
    fs.mkdirSync(directory);
  }
}

exports.update = function (req, res) {
  var item = req.item;
  console.log(req.files);
  console.log(req.files.image);
  console.log(req.files.image.name);
  // console.log(req);
  if (item) {
    var dir = './modules/items/client/img/uploads/';
    checkDirectorySync('./modules/items/client/img/');
    checkDirectorySync(dir);
    fs.writeFile(dir + req.files.image.name, req.files.image.buffer, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading item picture'
        });
      } else {
        item.image = '/modules/items/client/img/uploads/' + req.files.image.name;
        item.title = req.body.title;
        item.description = req.body.description;
        item.link = req.body.link;
        // item.image = req.body.image;
        item.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(item);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'Item not found.'
    });
  }
  
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










// Item tracking code

exports.addlog = function (req, res) {
    
   var log = new Log();
  log.userId = req.body.userId;
  log.itemId= req.body.itemId;
  console.log(req.body);
  log.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(log);
      res.json(log);
    }
  });
};

    
  
  
//  Log show function

exports.logs = function (req, res) {

  //  var count=0;

    //global.data=[];

    //   module.exports=arr=[];
 
     //module.exports=arr[count] = {};



  console.log(req.query.itemId);
  Log.find({'itemId': req.query.itemId}).sort('-time').populate( 'itemId').exec(function (err, logs) {
    


  
       userIds = [];
         times = [];
    for (var i = logs.length - 1; i >= 0; i--) {
             
             count=0;
            
            userIds[i] = logs[i].userId;
            times[logs[i].userId] = logs[i].time;
          console.log('hellow times');
        console.log(logs[i].userId);
          
        }  //End of For Loop
   
     console.log(userIds); 
    User.find({_id: {$in: userIds}}).exec(function(err,users){
      data = {};
      console.log(users);

      for (var i = users.length - 1; i >= 0; i--) {
       
        data[i]={};
        data[i]['user']= users[i].username;
        data[i]['time']= times[users[i]._id];

          console.log('hellow user i');
        console.log(users[i]);
      };
      console.log(data);
      res.json(data);
    });
  
      
  });  //End of Log.find functions


}; //  End of export.logs functions

exports.serveImage = function (req, res){
  var img = fs.readFileSync('./modules/items/client/img/uploads/'+req.params.image_name);
     res.writeHead(200, {'Content-Type': 'image/gif' });
     res.end(img);
};


exports.bycategory = function (req, res) {
  // console.log(req.params.categoryId);
  // console.log(req);
  // alert(req);
  Item.find({categoryId: req.params.categoryId}).sort('-created').populate( 'displayName').exec(function (err, items) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(items);
    }
  });
};

// exports.itemByCategory = function (req, res, next, id) {

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).send({
//       message: 'Item is invalid'
//     });
//   }

//   Item.findByCategoryId(id).populate('user', 'displayName').exec(function (err, item) {
//     if (err) {
//       return next(err);
//     } else if (!item) {
//       return res.status(404).send({
//         message: 'No item with that identifier has been found'
//       });
//     }
//     req.item = item;
//     next();
//   });
// };

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
  var category_id = req.query.category_id;
  xmlToJson(url, function(err, data) {
    if (err) {
      // Handle this however you like
      return console.err(err);
    }
    var json_string = JSON.stringify(data, null, 2);
    var import_data = JSON.parse(json_string);
    var items = import_data.rss.channel[0].item;
    var arr = [];
    if (items){
      for (var i = items.length - 1; i >= 0; i--) {
        var item = new Item({
          title: items[i].title[0],
          category: import_data.rss.channel[0].description[0],
          categoryId: category_id,
          description: items[i].description[0],
          link: items[i].link,
          isPermalink: items[i].guid.$,
          guid: items[i].guid[0]._,
          pubDate: items[i].pubDate[0] 
        });
        item.save();
      }
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
