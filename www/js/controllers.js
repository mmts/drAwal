angular.module('starter.controllers', [])


.controller('DashCtrl',function( $scope, $http, $timeout, $cordovaToast, $ionicLoading, $cordovaDevice){

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
        document.addEventListener("deviceready", function() {
            console.log(device.uuid);
            //get geoLocation
            var onSuccess = function(position) {
                 $scope.lat = position.coords.latitude.toString();
                 $scope.longt = position.coords.longitude.toString();
             };

             function onError(error) {
                  alert('code: '    + error.code    + '\n' +
                        'message: ' + error.message + '\n');
              }

            navigator.geolocation.getCurrentPosition(onSuccess, onError,{
                  enableHighAccuracy: true,
                  timeout: 3000,
                  maximumAge: 3000
            });



            var DeviceObject = Parse.Object.extend("DeviceObject");
            var query = new Parse.Query(DeviceObject);
            query.equalTo("uuid", device.uuid);
            query.find({
                success: function(results) {
                    console.log(results + " berhasil query");
                  if (results == ""){

                    var DeviceObject = Parse.Object.extend("DeviceObject");
                    var dd = new DeviceObject();
                    var ratio = window.devicePixelRatio;
                    dd.set("uuid", device.uuid);
                    dd.set("platform", device.platform + " - " + device.version);
                    dd.set("model", device.model);
                    dd.set("screenRes", (screen.width*ratio) + 'x' + (screen.height*ratio) );
                    dd.set("img", $cordovaDevice.getPlatform());
                    dd.set("longitude", $scope.longt);
                    dd.set("latitude", $scope.lat);  
                    console.log($scope.longt);                 
                    dd.save(null, {});
                    console.log("berhasil save");
                  }  
                  // Stop the ion-refresher from spinning
                  //$scope.$broadcast('scroll.refreshComplete');
                  var DeviceObjectAll = Parse.Object.extend("DeviceObject");
                  var queryAll = new Parse.Query(DeviceObjectAll);
                  queryAll.find({
                    success: function(results) {
                    $scope.items = results;
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                    },error: function(error) {
                        $timeout(function() {
                            $scope.$broadcast('scroll.refreshComplete');
                            $ionicLoading.hide();
                            //alert("Error: " + error.code + " " + error.message);
                            
                              $cordovaToast.showLongBottom('Please Check Your Internet Connection')
                        }, 1500);
                    } 

                  })
                    
                             
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
        }, false);

        
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


.controller('PushCtrl', function($scope, $rootScope, $ionicUser, $ionicPush, $http) {

  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
    // alert("Successfully registered token " + data.token);
    console.log('Ionic Push: Got token ', data.token, data.platform);
    console.log(data.token);
    $scope.token = data.token;
  });

  // Identifies a user with the Ionic User service
  $scope.identifyUser = function() {
    console.log('Ionic User: Identifying with Ionic User service');

    var user = $ionicUser.get();
    if(!user.user_id) {
      // Set your user_id here, or generate a random one.
      user.user_id = $ionicUser.generateGUID();
    };

    // Add some metadata to your user object.
    angular.extend(user, {
      name: 'Ionitron',
      bio: 'I come from planet Ion'
    });

    // Identify your user with the Ionic User Service
    $ionicUser.identify(user).then(function(){
      $scope.identified = true;
      alert('Identified user ' + user.name + '\n ID ' + user.user_id);
    });

    //push register
    console.log('Ionic Push: Registering user');

    // Register with the Ionic Push service.  All parameters are optional.
    $ionicPush.register({
      canShowAlert: true, //Can pushes show an alert on your screen?
      canSetBadge: true, //Can pushes update app icon badges?
      canPlaySound: true, //Can notifications play a sound?
      canRunActionsOnWake: true, //Can run actions outside the app,
      onNotification: function(notification) {
        console.log("notif");
        console.log(notification);
        // Handle new push notifications here
        // alert(notification);
        return true;
      }
    });

    //push notif ke token yang di atas
    console.log("hehe");
    var privateKey = 'ae7166efeb9d4b93373cf079e3516f3b76b9bcab1d99063d';
    var auth = btoa(privateKey + ':');
    var config = {headers:  {
        'Content-Type': 'application/json',
        'X-Ionic-Application-Id': '02ac90f6',
        'Authorization': 'basic ' + auth
      }
    };
    console.log($scope.token);
    $http.post('https://push.ionic.io/api/v1/push', {
      tokens: [$scope.token],
      //user_ids: ['da63a250-e505-4710-892b-0b0e160c603a'],
      notification: {
          alert: "Testing notif"
      }
    },config).success(function(response) {
      console.log("response push");
      //alert($scope.token);
      console.log(response);
    })


  };

  // $scope.pushNotifById = function() {
  //   console.log("hehe");
  //   var privateKey = 'ae7166efeb9d4b93373cf079e3516f3b76b9bcab1d99063d';
  //   var auth = btoa(privateKey + ':');
  //   var config = {headers:  {
  //       'Content-Type': 'application/json',
  //       'X-Ionic-Application-Id': '02ac90f6',
  //       'Authorization': 'basic ' + auth
  //     }
  //   };
    
  //   $http.post('https://push.ionic.io/api/v1/push', {
  //     tokens: [$scope.token_id],
  //     //user_ids: ['da63a250-e505-4710-892b-0b0e160c603a'],
  //     notification: {
  //         alert: "Testing notif"
  //     }
  //   },config).success(function(response) {
  //     alert($scope.token_id);
  //     console.log(response);
  //   })
  // }

  // Registers a device for push notifications and stores its token
  // $scope.pushRegister = function() {
  //   console.log('Ionic Push: Registering user');

  //   // Register with the Ionic Push service.  All parameters are optional.
  //   $ionicPush.register({
  //     canShowAlert: true, //Can pushes show an alert on your screen?
  //     canSetBadge: true, //Can pushes update app icon badges?
  //     canPlaySound: true, //Can notifications play a sound?
  //     canRunActionsOnWake: true, //Can run actions outside the app,
  //     onNotification: function(notification) {
  //       // Handle new push notifications here
  //       alert(notification);
  //       return true;
  //     }
  //   });
  // };
})


//chat
// .controller('ChatsCtrl', function($scope, Chats) {
//   // With the new view caching in Ionic, Controllers are only called
//   // when they are recreated or on app start, instead of every page change.
//   // To listen for when this page is active (for example, to refresh data),
//   // listen for the $ionicView.enter event:
//   //
//   //$scope.$on('$ionicView.enter', function(e) {
//   //});

//   $scope.chats = Chats.all();
//   $scope.remove = function(chat) {
//     Chats.remove(chat);
//   };
// })

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
