'use strict';
// Items controller
angular.module('items').controller('ItemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Items','$http',
  function ($scope, $stateParams, $location, Authentication, Items, $http) {
    $scope.authentication = Authentication;
      
    // Create new Article
    $scope.create = function () {
      // Create new Article object
      var item = new Items({
        title: this.title,
        description: this.description,
        category: this.category,
        link: this.link,
        pubDate: new Date()

      });

      // Redirect after save
      item.$save(function (response) {
        $location.path('items');

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (item) {
      if (item) {
        item.$remove();

        for (var i in $scope.items) {
          if ($scope.items[i] === item) {
            $scope.items.splice(i, 1);
          }
        }
      } else {
        $scope.item.$remove(function () {
          $location.path('items');
        });
      }
    };

    // Update existing Article
    $scope.update = function () {
      var item = $scope.item;

      item.$update(function () {
        $location.path('items');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Items
    $scope.find = function () {
      $scope.items = Items.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.item = Items.get({
        itemId: $stateParams.itemId
      });
    };

    function isXmlUrl(s) {
        if (s.indexOf('xml') === s.length - 3){
          return true;
        }else{
          return false;
        }
    }

    $scope.getCategory = function(){
      return $location.search().category;
    };
    // Post the imported content to server
    $scope.import = function(category_id) {
        // alert(typeof(category_id));
        if(isXmlUrl($scope.import_url)){
          $scope.error = false;
          $scope.notice = 'Import started';
          var posting = $http({
                        method: 'GET',
                        /*posting to /post */
                        url: '/api/items/import',
                        params: {url: $scope.import_url,category_id: category_id},
                    });
                    posting.success(function (response) {
                        /*executed when server responds back*/
                        $scope.notice = '';
                        console.log(response);
                        $scope.import_url= '';
                        $scope.notice = 'Items successfully imported.';
                        // alert('Items successfully imported.');
                        // $scope.response.data = response;
                    });
        }else{
          // alert('askdn');
          $scope.notice = false;
          $scope.error = 'Please enter a valid url, ending with .xml';

        }
      
    };
    $scope.submitForm = function(url,category_id){
      $scope.import_url = url;
      // alert(category_id);
      $scope.import(category_id);
    };
    $scope.dismiss_flash = function(event){
      $scope.error=''; $scope.notice=false;
    };
    $scope.formatDate = function(date){
          var dateOut = new Date(date);
          return dateOut;
    };
    $scope.getCategories = function(){
      var fetch = $http({
                        method: 'GET',
                        /*posting to /post */
                        url: '/api/categories',
                        params: {url: $scope.import_url},
                    });
                    fetch.success(function (response) {
                        /*executed when server responds back*/
                        $scope.categories= response;
                    });
    };    
    
  }
]);
