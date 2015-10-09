'use strict';

angular.module('core').controller('HomeController', ['$scope','$http', 'Authentication','$filter',
  function ($scope, $http, Authentication, $filter) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    var url = '/api/items';

   $http.get(url).success( function(response) {
      $scope.items = response; 
   });
   
  }
]);
