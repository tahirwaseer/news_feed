'use strict';

// Articles controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categories',
  function ($scope, $stateParams, $location, Authentication, Categories) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function () {
      // Create new Article object
      var category = new Categories({
        title: this.title,
        link: this.link
        

      });

      console.log('in create');
      // Redirect after save
      category.$save(function (response) {
         $location.path('categories');

        // Clear form fields
        $scope.title = '';
        $scope.link = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (category) {
      if (category) {
        category.$remove();

        for (var i in $scope.categories) {
          if ($scope.categories[i] === category) {
            $scope.categories.splice(i, 1);
          }
        }
      } else {
        $scope.category.$remove(function () {
          $location.path('categories');
        });
      }
    };

    // Update existing Article
    $scope.update = function () {
      var category = $scope.category;

      category.$update(function () {
        $location.path('categories');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.categories = Categories.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.category = Categories.get({
        categoryId: $stateParams.categoryId
      });
    };

    // Post the imported content to server
   //$scope.import = function() {
    //var import_data = angular.fromJson($scope.import_content);
     //var items = import_data.rss.channel.item;
      //var arr = [];
      //for (var i = items.length - 1; i >= 0; i--) {
        //var article = new Articles({
         //title: items[i].title.__cdata,
         // category: import_data.rss.channel.description,
          //description: items[i].description.__cdata,
         // link: items[i].link,
         // isPermalink: items[i].guid._isPermaLink,
        //  guid: items[i].guid.__text,
         // pubDate: items[i].pubDate 
        //});

        // Redirect after save
        //article.$save();
     //}
           
      
   // };




  }
]);
