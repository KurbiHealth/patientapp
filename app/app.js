var kurbiApp = angular.module('kurbiPatient', 
  ['ui.router', 'postDirectives','ui.WellnessSlider', 'CardsModule','ngFileUpload',
  'ngCookies','ui.bootstrap','uiRouterStyles','ngAside','angular-cloudinary','app.Components.InputTypeFile',
  'angularSpinner']); // ngImgCrop

// LOAD CONFIGURATION FILE (ALLOW FOR DEV OVERRIDE)
angular.element(document).ready(
  function() {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');

    $http.get('configDev.json')
    .success(function(data, status) {
        kurbiApp.constant('config', data);
        angular.bootstrap(document, ['kurbiPatient']);
    })
    .error(function(data, status, headers, config){
      $http.get('configTest.json')
      .success(function(data, status){
          kurbiApp.constant('config', data);
          angular.bootstrap(document, ['kurbiPatient']);
      })
      .error(function(data, status, headers, config){
        $http.get('config.json')
        .success(function(data){
            kurbiApp.constant('config', data);
            angular.bootstrap(document, ['kurbiPatient']);
        })
        .error(function(data, status, headers, config){
          var temp = {
            apiUrl: 'http://api.gokurbi.com/v1/',
            hdaApiUrl: 'http://hdaapi.gokurbi.com/v1/',
            environment: 'prod'
          }
          kurbiApp.constant('config', temp);
          angular.bootstrap(document, ['kurbiPatient']);
        }); // end of 3rd .error
      }); // end of 2nd .error
    }); // end of 1st .error
  }
);

kurbiApp.config(function($logProvider, $stateProvider, $urlRouterProvider, cloudinaryProvider, 
  $httpProvider) {
  
  $logProvider.debugEnabled(true);

  //$httpProvider.defaults.useXDomain = true;
  //delete $httpProvider.defaults.headers.common['X-Requested-With']; 

  cloudinaryProvider.config({
    upload_endpoint: 'https://api.cloudinary.com/v1_1/', // default
    cloud_name: 'kurbi', // required
    upload_preset: 'am044ys5' // optional
  });

  // https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-set-up-a-defaultindex-child-state
  // https://github.com/angular-ui/ui-router/wiki#resolve

  $urlRouterProvider.when('', '/app/journal');

  $stateProvider

// PUBLIC PAGES

  /* this code was removed from "state('public'," due to webflow change  
    data: {
      css: ['design/css/public/kurbi.webflow.css','design/css/public/webflow.css','design/css/public/normalize.css']
    }
  */
  .state('public',{
    url: '/public',
    templateUrl: 'design/templates/publicMasterTemplate.html'
  })

  .state('public.logInPage',{
    url: '/login',
    templateUrl: 'design/templates/publicLogin.html'
  })
  
// PRIVATE PAGES (REQUIRE LOGIN)

  .state('private',{
    url: '/app',
    templateUrl: 'design/templates/privateMasterTemplate.html',
    controller: 'mainController',
    resolve: {authenticate: authenticate}
  })

  .state('private.home', {
      url: '/home',
      templateUrl: 'modules/feed/templates/index.html'
  })
  
  .state('private.journal', {
    url: '/journal',
    templateUrl: 'modules/journal/templates/index.html'
  })

  .state('private.goals', {
    url: '/goals',
    templateUrl: 'modules/goal/templates/index.html'
  })
  
  .state('private.path', {
    url: '/path',
    templateUrl: 'modules/goal/templates/path-detail.html'
  })

  .state('private.care-plan', {
    url: '/care-plan',
    templateUrl: 'app/templates/care-plan-index.html'
  })
  
  .state('private.live-chart', {
    url: '/live-chart',
    templateUrl: 'modules/live-chart/templates/temp-live-chart.html'
    // templateUrl: 'modules/live-chart/templates/index.html'
    // templateUrl: 'modules/live-chart/templates/live-chart-list.html'
  })

  ;

  function authenticate ($q, user, $cookies) {
    // the user.authenticated() function returns a promise, so that can be passed right back
    // to resolve. When the promise gets rejected, it triggers the $rootScope.$on('$stateChangeError',...)
    // below in kurbiApp.run().
    var authPromise = user.authenticated();
    return authPromise;
  }

});

kurbiApp.run(['$rootScope', 'posts', 'api', 'user', '$q', '$state','$http',
function ($rootScope, posts, api, user, $q, $state,$http){

  // FOR DEBUGGING UI-ROUTER ($state)
  // $rootScope.$on("$stateChangeError", console.log.bind(console));

  $rootScope.$on('$stateChangeError', function () {
    // Redirect user to our login page
    $state.go('public.logInPage');
  });

}]);