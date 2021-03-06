'use strict';

/**
 * Module dependencies.
 */
var categoriesPolicy = require('../policies/categories.server.policy'),
  categories = require('../controllers/categories.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/categories').all(categoriesPolicy.isAllowed)
    .get(categories.list)
    .post(categories.create);

  // Single article routes
  app.route('/api/categories/:categoryId').all(categoriesPolicy.isAllowed)
    .get(categories.read)
    .put(categories.update)
    .delete(categories.delete);
  app.route('/api/categories/:categoryId/items').all(categoriesPolicy.isAllowed)
    .get(categories.items);
    
  
  // Finish by binding the article middleware
  app.param('categoryId', categories.categoryByID);

  app.route('/modules/categories/client/img/uploads/:image_name').all(categoriesPolicy.isAllowed)
    .get(categories.serveImage);
};
