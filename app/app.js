var kurbiApp = angular.module('kurbiPatient', ['ui.router', 'postDirectives']);

kurbiApp.config(function($stateProvider, $urlRouterProvider) {
	
	$urlRouterProvider.otherwise('/home');
	$stateProvider
        
  .state('home', {
      url: '/home',
      templateUrl: 'modules/feed/templates/index.html'
  })
  
  .state('journal', {
  	url: '/journal',
  	templateUrl: 'app/templates/journal_index.html'
  })
  
  .state('care-plan', {
  	url: '/care-plan',
  	templateUrl: 'app/templates/care-plan_index.html'
  })
  
  .state('progress-chart', {
  	url: '/progress-chart',
  	templateUrl: 'app/templates/progress-chart_index.html'
  })
  
  ;
        
});

kurbiApp.run(['$rootScope', 'posts', 'api', 'user', '$q', 
function ($rootScope, posts, api, user, $q){

  api.postsInit(user,$rootScope); // sets $scope.posts

  api.careTeamInit(user,$rootScope); // sets $scope.careTeamList

}]);