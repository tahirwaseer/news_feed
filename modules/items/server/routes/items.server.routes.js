'use strict';

/**
 * Module dependencies.
 */
var itemsPolicy = require('../policies/items.server.policy'),
  items = require('../controllers/items.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/items').all(itemsPolicy.isAllowed)
    .get(items.list)
    .post(items.create);
  // Articles import 
  app.route('/api/items/import').all(itemsPolicy.isAllowed)
    .get(items.import);
  
  // Single item routes
  app.route('/api/items/:itemId').all(itemsPolicy.isAllowed)
    .get(items.read)
    .put(items.update)
    .delete(items.delete);

  // Returns items for given category_id
  app.route('/api/items/bycategory/:categoryId').all(itemsPolicy.isAllowed)
    .get(items.bycategory);
    
  // Finish by binding the item middleware
  app.param('itemId', items.itemByID);
  // app.param('categoryId', items.itemByCategoryId);
};
