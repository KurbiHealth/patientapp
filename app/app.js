var kurbiApp = angular.module('kurbiPatient', ['ui.router', 'postDirectives', 'ui.bootstrap']);

kurbiApp.config(function($logProvider, $stateProvider, $urlRouterProvider) {
	
  $logProvider.debugEnabled(true);

  // https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-set-up-a-defaultindex-child-state
  // https://github.com/angular-ui/ui-router/wiki#resolve

  $urlRouterProvider.when('', '/public/home');

	$stateProvider

// PUBLIC PAGES

  .state('public',{
    url: '/public',
    templateUrl: 'design/templates/publicMasterTemplate.html'
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
    resolve: {authenticate: authenticate }
  })

  .state('private.home', {
      url: '/home',
      templateUrl: 'modules/feed/templates/index.html'
  })
  
  .state('private.journal', {
    url: '/journal',
    templateUrl: 'app/templates/journal_index.html'
  })

  .state('private.goals', {
    url: '/goals',
    templateUrl: 'modules/goal/templates/index.html'
  })

  .state('private.care-plan', {
    url: '/care-plan',
    templateUrl: 'app/templates/care_plan_index.html'
  })
  
  .state('private.progress-chart', {
    url: '/progress-chart',
    templateUrl: 'app/templates/progress_chart_index.html'
  })

  ;

  function authenticate ($q, user) {
    var deferred = $q.defer();
    if(user.loggedIn == true){
      deferred.resolve();
    }else{
      deferred.reject('not logged in');
    }
    return deferred.promise;
  }

});

kurbiApp.run(['$rootScope', 'posts', 'api', 'user', '$q', '$state',
function ($rootScope, posts, api, user, $q, $state){

  // FOR DEBUGGING
  // $rootScope.$on("$stateChangeError", console.log.bind(console));

  $rootScope.$on('$stateChangeError', function () {
    // Redirect user to our login page
    $state.go('public.logInPage');
  });

  api.postsInit($rootScope);

  api.careTeamInit().then(function(data){
    $rootScope.careTeamList = data;
  });

}]);