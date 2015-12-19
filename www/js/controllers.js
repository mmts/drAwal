angular.module('starter.controllers', [])

.controller('DashCtrl',function( $scope, $http, $timeout, $cordovaToast, $ionicLoading){

 //getting info from REST api from parse 
 //$scope.items = [  ];

 $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

  // $scope.getItems = function() {


  //   $http({method : 'GET',url : 'https://api.parse.com/1/classes/DeviceObject', 
  //     headers:  {  'X-Parse-Application-Id':'rIErvZmEdzJQ5QADjiRhqhUdouVnvjwCYP9qWmyg', 
  //                  'X-Parse-REST-API-Key':'Ap0lsJcdz1tcFRK9I6Ogjlstcr72f3v8tHYTvuJk'
  //               }})


  //       .success(function(data, status) {

  //         $timeout(function() {
  //           //data baru 
  //           $scope.items = data;

  //           $scope.$broadcast('scroll.refreshComplete');
  //           $ionicLoading.hide();
  //         }, 1000);
  //       })
  //       .error(function(data, status) {
  //         $timeout(function() {
  //           console.log(error.message);
  //           $cordovaToast.showLongBottom('Please Check Your Internet Connection')
  //             .then(function(success) {
  //                 // Do something on success
  //             }, function(error) {
  //                 // Handle error
  //           });
          
  //         $scope.$broadcast('scroll.refreshComplete');
  //         }, 1000);
  //       })

  //   }
 
 $scope.getItems = function(params) {
        var DeviceObject = Parse.Object.extend("DeviceObject");
        var query = new Parse.Query(DeviceObject);
        query.find({
            success: function(results) {
                console.log(results);
                //alert("Successfully retrieved " + results.length + " Device!");
                $scope.items = results;
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.hide();
                // $scope.$apply();


                // for (var i = 0; i < results.length; i++) {
                //     var object = results[i];
                //     //return{object.id + ' - ' + object.get("uuid") + " " + object.get("platform")};
                //       $scope.$apply(function(){
                //       $scope.items.push(object);
                //     });
                //     console.log(object);  
                                                        
                // }
              // Stop the ion-refresher from spinning
              //$scope.$broadcast('scroll.refreshComplete');
              
                         
            },
            error: function(error) {
                $timeout(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                    //alert("Error: " + error.code + " " + error.message);
                    
                      $cordovaToast.showLongBottom('Please Check Your Internet Connection')
                }, 1500);
            }  
        
        });
    };
})


.controller('MapCtrl', function(NgMap, $scope, $stateParams) {
  NgMap.getMap().then(function(map) {
    console.log(map.getCenter());
    console.log('markers', map.markers);
    console.log('shapes', map.shapes);
  });

  // onSuccess Callback
$scope.longitude = $stateParams.longitude;
$scope.latitude = $stateParams.latitude;
  


})

.controller('DevInfoCtrl', function($scope) {
  $scope.getDevice = function(params) {
        var DeviceObject = Parse.Object.extend("DeviceObject");
        var query = new Parse.Query(DeviceObject);
        if(params !== undefined) {
                query.equalTo("uuid", params);
        }
        query.find({
            success: function(results) {
                alert("Successfully retrieved " + results.length + " Device!");
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    alert(object.id + ' - ' + object.get("uuid") + " " + object.get("platform"));
                }
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    };
})


.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
