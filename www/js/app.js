// Ionic Starter App
    
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionicLazyLoad', 'starter.controllers', 'starter.services', 'ngMap', 'ionic.service.core', 'ionic.service.push'])

//identify ionic
.config(['$ionicAppProvider', function($ionicAppProvider) {
  // Identify app
  $ionicAppProvider.identify({
    // The App ID (from apps.ionic.io) for the server
    app_id: '02ac90f6',
    // The public API key all services will use for this app
    api_key: '39864c50d9afa352ae20d13ba1b39aa39c8f5f71bd892e35',
    // Set the app to use development pushes
    dev_push: true
  });
}])



.run(function($ionicPlatform, $ionicUser, $ionicPush, $rootScope) {
                    
                    $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
                      console.log("Successfully registered token " + data.token);
                      //console.log('Ionic Push: Got token ', data.token, data.platform);
                      //console.log(data.token);
                      //console.log(data.platform);
                      $rootScope.token = data.token;
                    });

                    
//parse thing
    Parse.initialize("rIErvZmEdzJQ5QADjiRhqhUdouVnvjwCYP9qWmyg", "kJO9VZyTC66aSVS8EhoHe3ggvx63yRB1AGdmTzku");
  
  $ionicPlatform.ready(function() {

    // myServices.setDeviceUUID(device.uuid);
    // alert(myServices.getDeviceUUID());
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.dash-info', {
    url: '/dash/:longitude/:latitude/:token_id',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-info.html',
        controller: 'MapCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
