'use strict';
// Items controller
angular.module('items').directive('fileModel', ['$parse', function ($parse) {
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

 angular.module('items').service('multipartForm', ['$http', function ($http) {
    this.post = function(data, uploadUrl,$location){
       var fd = new FormData();

       for(var key in data){
        fd.append(key,data[key]);
       }
    
       $http.put(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
       })
    
       .success(function(){
        $location.path('items');

       })
    
       .error(function(){
       });
    };
 }]);

angular.module('items').controller('ItemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Items','$http','multipartForm',
  function ($scope, $stateParams, $location, Authentication, Items, $http,multipartForm) {
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
      console.log('reororo');
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
      var uploadUrl='/api/items/'+item._id;
      console.log(item);
      multipartForm.post(item,uploadUrl,$location);
      // item.$update(function () {
      //   $location.path('items');
      // }, function (errorResponse) {
      //   $scope.error = errorResponse.data.message;
      // });
    };
    $scope.gethistory = function(item){
     // alert(item._id);
      // var item = $scope.item;
      var posting = $http({
                        method: 'GET',
                        /*posting to /post */
                        url: '/api/logs',
                        params: {itemId: item._id}
                    });
                    posting.success(function (response) {
                        /*executed when server responds back*/
                        $scope.history = response;
                        // alert('Items successfully imported.');
                        // $scope.response.data = response;
                    });
    };
    // Find a list of Items
    $scope.find = function () {
      // var result = Items.query();
      var path = $location.absUrl().split('?');
      console.log(path[1]);
      if (!path[1]) {
        path[1] = 'page=1';
      };
      $http.get('/api/items?frontend=true&'+path[1])
    
       .success(function(result){
        console.log(result);
        var totalItems = result.total;
        var pageLimit = result.limit;
        $scope.pageCount = totalItems/pageLimit;
        $scope.items = result.docs;
       })
    };
    $scope.loadPage= function(pageNumber){
      $scope.pageNumber = pageNumber;
      $scope.currentPage = pageNumber;
      $scope.find();
      // $http.get('/api/items?page='+pageNumber)
    
      //  .success(function(result){
      //   console.log(result);
      //   var totalItems = result.total;
      //   var pageLimit = result.limit;
      //   $scope.pageCount = totalItems/pageLimit;
      //   $scope.items = result.docs;
      // })
    }
    $scope.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.item = Items.get({
        itemId: $stateParams.itemId
      });
      // console.log($scope.item);
      var posting = $http({
                        method: 'GET',
                        /*posting to /post */
                        url: '/api/logs',
                        params: {itemId: $stateParams.itemId}
                    });
                    posting.success(function (response) {
                        /*executed when server responds back*/
                        $scope.history = response;
                        
                        // $scope.response.data = response;
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
