var kurbiApp = angular.module('kurbiPatient', 
  ['ui.router', 'postDirectives','ui.WellnessSlider','CardsModule','ngFileUpload','ngCookies','ui.bootstrap','uiRouterStyles']);

kurbiApp.config(function($logProvider, $stateProvider, $urlRouterProvider) {
	
  $logProvider.debugEnabled(true);

  // https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-set-up-a-defaultindex-child-state
  // https://github.com/angular-ui/ui-router/wiki#resolve

  $urlRouterProvider.when('', '/public/home');

	$stateProvider

// PUBLIC PAGES

  .state('public',{
    url: '/public',
    templateUrl: 'design/templates/publicMasterTemplate.html',
    data: {
      css: ['design/css/normalize.css','design/css/webflow.css','design/css/gokurbi.webflow.css']
    }
  })

  .state('public.home',{
    url: '/home',
    templateUrl: 'design/templates/publicHome.html'
  })

  .state('public.ourstory', {
    url: '/our-story',
    templateUrl: 'design/templates/publicOurstory.html'
  })

  .state('public.logInPage',{
    url: '/login',
    templateUrl: 'design/templates/publicLogin.html'
  })
  
// PRIVATE PAGES (REQUIRE LOGIN)

  .state('private',{
    url: '/app',
    templateUrl: 'design/templates/privateMasterTemplate.html', 
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

  .state('private.care-plan', {
    url: '/care-plan',
    templateUrl: 'app/templates/care-plan-index.html'
  })
  
  .state('private.progress-chart', {
    url: '/progress-chart',
    templateUrl: 'modules/progress-chart/templates/index.html'
  })

  ;

  function authenticate ($q, user, $cookies) {
    var deferred = $q.defer();
    if(user.loggedIn === true){
      deferred.resolve();
    }else{
      if($cookies.token != ''){
        user.loggedIn = true;
        deferred.resolve();
      }else{
        deferred.reject('not logged in');
      }
    }
    return deferred.promise;
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

  // ADD CONFIG VALUES
  $http.get('configDev.js')
  .success(function(data) {
    $rootScope.apiUrl       = configData.apiUrl;
    $rootScope.hdaApiUrl    = configData.hdaApiUrl;
    $rootScope.environment  = configData.environment;
  })
  .error(function(data, status, headers, config) {
    $http.get('configDev.js')
    .success(function(data) {
      $rootScope.apiUrl       = configData.apiUrl;
      $rootScope.hdaApiUrl    = configData.hdaApiUrl;
      $rootScope.environment  = configData.environment;
    })
    .error(function(data, status, headers, config){
      $rootScope.apiUrl       = '';
      $rootScope.hdaApiUrl    = '';
      $rootScope.environment  = '';
    });
  });

}]);