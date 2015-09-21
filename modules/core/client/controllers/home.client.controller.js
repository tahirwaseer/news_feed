'use strict';

angular.module('core').controller('HomeController', ['$scope','$http', 'Authentication',
  function ($scope, $http, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    var url = '/api/articles';

   $http.get(url).success( function(response) {
      $scope.articles = response; 
   });
  }
]);
