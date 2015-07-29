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

	// for PAGE SLIDER (html is in /globaldesign/templates/privateMaster.html)
	$scope.pageslideChosen = false; 
	// This will be binded using the ps-open attribute

    $scope.togglePageslider = function(templatePath){
        $scope.pageslideChosen = !$scope.pageslideChosen;
       	$scope.pagesliderTemplate = templatePath;
console.log(templatePath);
    }

    $scope.closePageslider = function(){
    	$scope.pageslideChosen = !$scope.pageslideChosen;
    }

    $scope.pagesliderTemplate = 'default';

}]);