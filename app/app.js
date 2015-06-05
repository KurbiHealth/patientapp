var kurbiApp = angular.module('kurbiPatient', ['ui.router', 'postDirectives']);

kurbiApp.config(function($stateProvider, $urlRouterProvider) {
	
	$urlRouterProvider.otherwise('/app/home');
	$stateProvider

// PUBLIC PAGES

/*  .state('public',{
    url: '/p',
    // templateUrl: 'design/templates/publicMasterTemplate.html'
    template: '<ui-view/>'
  })
*/
/*  .state('home',{
    url: '/homeish',
    //templateUrl: 'design/templates/publicHome.html'
    template: '<p>public home</p>'
  })

  .state('ourstory', {
    url: '/our-story',
    templateUrl: 'design/templates/publicOurstory.html'
  })
*/

// PRIVATE PAGES (REQUIRE LOGIN)

  .state('logInPage',{
    url: '/login',
    templateUrl: 'design/templates/publicLogin.html'
  })

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
  
  .state('private.care-plan', {
    url: '/care-plan',
    templateUrl: 'app/templates/care-plan_index.html'
  })
  
  .state('private.progress-chart', {
    url: '/progress-chart',
    templateUrl: 'app/templates/progress-chart_index.html'
  })

  ;

  function authenticate($q, $state, $timeout, user) {
    if (user.loggedIn == true) {
      // Resolve the promise successfully
      return $q.when();
    } else {
      // The next bit of code is asynchronously tricky.

      $timeout(function() {
        // This code runs after the authentication promise has been rejected.
        // Go to the log-in page
        $state.go('logInPage');
      })

      // Reject the authentication promise to prevent the state from loading
      return $q.reject();
    }
  }

});

kurbiApp.run(['$rootScope', 'posts', 'api', 'user', '$q', '$state',
function ($rootScope, posts, api, user, $q, $state){

  api.postsInit(user,$rootScope);

  api.careTeamInit(user).then(function(data){
    $rootScope.careTeamList = data;
  });

}]);