'use strict';
angular.module('categories').directive('fileModel', ['$parse', function ($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;
          
          element.bind('change', function(){
             scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
             });
          });
       }
    };
 }]);

 angular.module('categories').service('multipartForm1', ['$http', function ($http) {
    this.post = function(data, uploadUrl,$location,request_type){
       var fd = new FormData();

       for(var key in data){
        fd.append(key,data[key]);
       }
      console.log('in multipartForm');
      if (request_type==='put') {
          $http.put(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
          })
          .success(function(){
          console.log('success');
          $location.path('categories');
         })
         .error(function(){
         });
      }else{
        $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
         }).success(function(){
          console.log('success');
          $location.path('categories');
         })
         .error(function(){
         });
      } 
       
    };
 }]);
// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categories','$http','multipartForm1',
  function ($scope, $stateParams, $location, Authentication, Categories,$http,multipartForm1) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function () {
      // Create new Article object
      var category = new Categories({
        title: this.title,
        link: this.link,
        sourceName: this.sourceName,
        sourceImage: this.sourceImage
      });
      var uploadUrl='/api/categories/';
      // console.log(category);
      multipartForm1.post(category,uploadUrl,$location,'post');
      // Redirect after save
      // category.$save(function (response) {
      //    $location.path('categories');

      //   // Clear form fields
      //   $scope.title = '';
      //   $scope.link = '';
      // }, function (errorResponse) {
      //   $scope.error = errorResponse.data.message;
      // });
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
    // $scope.update = function () {
    //   var category = $scope.category;

    //   category.$update(function () {
    //     $location.path('categories');
    //   }, function (errorResponse) {
    //     $scope.error = errorResponse.data.message;
    //   });
    // };
    $scope.update = function () {
      var category = $scope.category;
      var uploadUrl='/api/categories/'+category._id;
      // console.log(category);
      multipartForm1.post(category,uploadUrl,$location,'put');
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
