'use strict';

//Articles service used for communicating with the items REST endpoints
angular.module('items').factory('Items', ['$resource',
  function ($resource) {
    return $resource('api/items/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
