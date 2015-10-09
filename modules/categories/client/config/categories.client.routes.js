'use strict';

// Setting up route
angular.module('categories').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('categories', {
        abstract: true,
        url: '/categories',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('categories.list', {
        url: '',
        templateUrl: 'modules/categories/views/list-categories.client.view.html'
      })
      .state('categories.create', {
        url: '/create',
        templateUrl: 'modules/categories/views/create-category.client.view.html'
      })
      .state('categories.view', {
        url: '/:categoryId',
        templateUrl: 'modules/categories/views/view-category.client.view.html'
      })
      .state('categories.edit', {
        url: '/:categoryId/edit',
        templateUrl: 'modules/categories/views/edit-category.client.view.html'
      })
      .state('categories.import', {
        url: '/:categoryId/import',
        templateUrl: 'modules/categories/views/import-category.client.view.html'
      });
  }
]);
