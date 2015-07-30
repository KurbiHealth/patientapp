kurbiApp.controller('mainController', ['$state','$scope', 'posts', 
	'api', 'user', '$q','$aside',
function ($state,$scope, posts, api, user, $q, $aside) {

	// =====================
	// SIDEBAR ACCORDION(S)
	// =====================
	$scope.isCollapsed = false;

	// =====================
	// LOGOUT FUNCTION
	// =====================
	$scope.logOut = function(){
		user.loggedIn = false;
		user.token = '';
		user.password = '';
		$cookies = {};
		$state.go('public.logInPage');
	};

	// =====================
	// GLOBAL USER VALUES
	// =====================
	user.getUser();
	$scope.firstName = user.firstName;
	$scope.lastName = user.lastName;

	// =====================
	// INITIALIZE LISTS
	// =====================
	// Care Team List
	api.careTeamInit().then(function(teammates){
		$scope.careTeamList = teammates;
	});
	// Goals List
	api.goalsInit().then(function(goals){
console.log(goals);
		$scope.goalsList = goals;
	});

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