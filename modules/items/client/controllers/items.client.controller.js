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

    // Post the imported content to server
    $scope.import = function() {
        // $scope.categories = $http({
        //                 method: 'GET',
        //                 /*posting to /post */
        //                 url: '/api/categories',
        //                 params: {url: $scope.import_url},
        //             });
        if(isXmlUrl($scope.import_url)){
          $scope.error = false;
          $scope.notice = 'Import started';
          var posting = $http({
                        method: 'GET',
                        /*posting to /post */
                        url: '/api/items/import',
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
      //   var item = new Items({
      //     title: items[i].title.__cdata,
      //     category: import_data.rss.channel.description,
      //     description: items[i].description.__cdata,
      //     link: items[i].link,
      //     isPermalink: items[i].guid._isPermaLink,
      //     guid: items[i].guid.__text,
      //     pubDate: items[i].pubDate 
      //   });

      //   // Redirect after save
      //   item.$save();
      // }
      //  $location.path('items');
            
      
    };
    $scope.submitForm = function(url){
      $scope.import_url = url;
      // alert('hell');
      $scope.import();
    };
    $scope.dismiss_flash = function(event){
      $scope.error=''; $scope.notice=false;
    };
    $scope.formatDate = function(date){
          var dateOut = new Date(date);
          return dateOut;
    };
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
    // $scope.categories = [
    //                       {'title':'News','link':'https://newsroom.accenture.com/news/rss.xml'}, 
    //                       {'title':'Industries','link':'https://newsroom.accenture.com/industries/rss.xml'},
    //                       {'title':'Agribusiness','link':'https://newsroom.accenture.com/industries/agribusiness/rss.xml'} ,
    //                       {'title':'Airlines','link':'https://newsroom.accenture.com/industries/airlines/rss.xml'} ,
    //                       {'title':'Automotive','link':'https://newsroom.accenture.com/industries/automotive/rss.xml'} ,
    //                        {'title':'Communications','link':'https://newsroom.accenture.com/industries/communications/rss.xml'} ,
    //                       {'title':'Consumer Goods &  Services', 'link':'https://newsroom.accenture.com/industries/consumer-goods--services/rss.xml'} ,
    //                       {'title':'Electronics & High Tech', 'link':'https://newsroom.accenture.com/industries/electronics-high-tech/rss.xml'} ,
    //                       {'title':'Freight & Logistics','link':'https://newsroom.accenture.com/industries/freight-logistics/rss.xml'},
    //                       {'title':'Health & Life Sciences','link':'https://newsroom.accenture.com/industries/health-life-sciences/rss.xml'},
    //                       {'title':'Industrial Equipment','link':'https://newsroom.accenture.com/industries/industrial-equipment/rss.xml'},
    //                       {'title':'Management Consulting','link':'https://newsroom.accenture.com/industries/management-consulting/rss.xml'},

    //                       {'title':'Media & Entertainment','link':'https://newsroom.accenture.com/industries/media-entertainment/rss.xml'},

    //                       {'title':'Public Transportation','link':'https://newsroom.accenture.com/industries/public-transportation/rss.xml'},

    //                       {'title':'Rail','link':'https://newsroom.accenture.com/industries/rail/rss.xml'},


    //                       {'title':'Retail','link':'https://newsroom.accenture.com/industries/retail/rss.xml'},

    //                       {'title':'Strategy','link':'https://newsroom.accenture.com/industries/strategy/rss.xml'},

    //                       {'title':'Travel Services / Hospitality','link':'https://newsroom.accenture.com/industries/travel-services-hospitality/rss.xml'},

    //                       {'title':'Subjects','link':'https://newsroom.accenture.com/subjects/rss.xml'},


    //                       {'title':'Acquisitions','link':'https://newsroom.accenture.com/subjects/acquisitions/rss.xml'},

    //                       {'title':'Analytics','link':'https://newsroom.accenture.com/subjects/analytics/rss.xml'},


    //                       {'title':'Client Wins/New Contracts','link':'https://newsroom.accenture.com/subjects/client-winsnew-contracts/rss.xml'},

    //                       {'title':'Digital','link':'https://newsroom.accenture.com/subjects/digital/rss.xml'},

    //                       {'title':'Financial/ Earnings','link':'https://newsroom.accenture.com/subjects/financial-earnings/rss.xml'},

    //                       {'title':'Interactive Marketing','link':'https://newsroom.accenture.com/subjects/interactive-marketing/rss.xml'},

    //                       {'title':'Leadership / Management','link':'https://newsroom.accenture.com/subjects/leadership-management/rss.xml'},

    //                       {'title':'Management Consulting','link':'https://newsroom.accenture.com/subjects/management-consulting/rss.xml'},

    //                       {'title':'Mobility','link':'https://newsroom.accenture.com/subjects/mobility/rss.xml'},

    //                       {'title':'Operations','link':'https://newsroom.accenture.com/subjects/operations/rss.xml'},

    //                       {'title':'Outsourcing','link':'https://newsroom.accenture.com/subjects/outsourcing/rss.xml'},


    //                       {'title':'Research / Surveys','link':'https://newsroom.accenture.com/subjects/research-surveys/rss.xml'},

    //                       {'title':'Strategy','link':'https://newsroom.accenture.com/subjects/strategy/rss.xml'},

    //                       {'title':'Technology','link':'https://newsroom.accenture.com/subjects/technology/rss.xml'}
    //                       ];


  }
]);
