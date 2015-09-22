'use strict';
// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles','$http',
  function ($scope, $stateParams, $location, Authentication, Articles, $http) {
    $scope.authentication = Authentication;
      
    // Create new Article
    $scope.create = function () {
      // Create new Article object
      var article = new Articles({
        title: this.title,
        description: this.description,
        category: this.category,
        link: this.link,
        pubDate: new Date()

      });

      // Redirect after save
      article.$save(function (response) {
        $location.path('articles');

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function () {
      var article = $scope.article;

      article.$update(function () {
        $location.path('articles');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };

    function isXmlUrl(s) {
        if (s.indexOf('xml') === s.length - 3){
          return true;
        }else{
          return false;
        }
    }

    // Post the imported content to server
    $scope.import = function() {
        if(isXmlUrl($scope.import_url)){
          $scope.error = false;
          $scope.notice = 'Import started';
          var posting = $http({
                        method: 'GET',
                        /*posting to /post */
                        url: '/api/articles/import',
                        params: {url: $scope.import_url},
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
      // var import_data = angular.fromJson($scope.import_content);
      // var items = import_data.rss.channel.item;
      // var arr = [];
      // for (var i = items.length - 1; i >= 0; i--) {
      //   var article = new Articles({
      //     title: items[i].title.__cdata,
      //     category: import_data.rss.channel.description,
      //     description: items[i].description.__cdata,
      //     link: items[i].link,
      //     isPermalink: items[i].guid._isPermaLink,
      //     guid: items[i].guid.__text,
      //     pubDate: items[i].pubDate 
      //   });

      //   // Redirect after save
      //   article.$save();
      // }
      //  $location.path('articles');
            
      
    };
    $scope.dismiss_flash = function(event){
      $scope.error=''; $scope.notice=false;
    };
    $scope.formatDate = function(date){
          var dateOut = new Date(date);
          return dateOut;
    };
  }
]);
