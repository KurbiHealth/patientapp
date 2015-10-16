kurbiApp.controller('mainController', ['$state','$rootScope','$scope', 'posts', 
	'api', 'user', '$q','$aside',
function ($state,$rootScope,$scope, posts, api, user, $q, $aside) {

	// =====================
	// GLOBAL VARIABLES 
	// =====================

	// USER VALUES
	user.getUser();
	$scope.firstName = user.firstName;
	$scope.lastName = user.lastName;

	// LISTS
	// Care Team List
	api.careTeamInit().then(function(teammates){
		$rootScope.careTeamList = teammates;
	});
	// Goals List
	api.goalsInit().then(function(goals){
		$rootScope.goalsList = goals;
	});

	// LAST
	$scope.templast = false;
var kurbiGlobal = {};
	kurbiGlobal.templast = false;
console.log('$rootScope',$rootScope);
console.log('kurbiGlobal',kurbiGlobal);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	// =====================
	// SIDEBAR ACCORDION(S)
	// =====================
	$scope.isCollapsed = false;

	// =====================
	// LOGOUT FUNCTION
	// =====================
	$scope.logOut = function(){
		$cookies = {};
console.log($cookies);
		user.loggedIn = false;
		user.token = '';
		user.password = '';
user.getUser();
console.log(user);
console.log($rootScope);
		$state.go('public.logInPage');
	};

	// =====================
	// PAGE SLIDER
	// =====================
    $scope.asideState = {
      open: false
    };
    
    $scope.openAside = function(position, backdrop, template) {
      $scope.asideState = {
        open: true,
        position: position
      };
      
      function postClose() {
        $scope.asideState.open = false;
      }
      
      $aside.open({
      	// all options: http://angular-ui.github.io/bootstrap/#/modal
        templateUrl: template,
        placement: position,
        size: 'sm',
        backdrop: backdrop,
        controller: function($scope, $modalInstance) {
          $scope.ok = function(e) {
            $modalInstance.close();
            e.stopPropagation();
          };
          $scope.cancel = function(e) {
            $modalInstance.dismiss();
            e.stopPropagation();
          };
        }
      }).result.then(postClose, postClose);
    }

}]);