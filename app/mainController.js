kurbiApp.controller('mainController', ['$state','$scope', 'posts', 'api', 'user', '$q', 
function ($state,$scope, posts, api, user, $q) {

	// COLLAPSE =====================
	$scope.isCollapsed = false;

	$scope.logOut = function(){
		user.loggedIn = false;
		$cookies = {};
		$state.go('public.logInPage');
	};

	user.getUser();
	$scope.firstName = user.firstName;
	$scope.lastName = user.lastName;

}]);