kurbiApp.controller('mainController', ['$state','$rootScope','$scope', 'posts', 
	'api', 'user', '$q','$aside','journalEntriesSvc',
function ($state,$rootScope,$scope, posts, api, user, $q, $aside, journalEntriesSvc) {

	// =====================
	// GLOBAL VARIABLES 
	// =====================

	// GOAL/PATH VALUES
	$rootScope.currentGoalActivity = {};

	// USER VALUES
	user.getUser();
	$scope.firstName = user.firstName;
	$scope.lastName = user.lastName;
	$scope.avatarImage = '/design/user_images/' + user.imageFileName;
	$scope.userLoggedIn = user.loggedIn;

	// LISTS
	if(user.loggedIn === true){
	
		// Care Team List
		// NOTE: This function also used in the PostsController to pass in author info to the posts - Matt E. 11/2/2015
		api.careTeamInit().then(function(teammates){
			$rootScope.careTeamList = teammates;
		
		// Posts 
			api.postsInit($rootScope,teammates);
		});

		// Goals List
		api.goalsInit().then(function(goals){
			$rootScope.goalsList = goals;
		});

		// Goals Activities List
		api.getGoalActivitiesList()
		.then(function(list){
			$rootScope.goalActivitiesList = list;
		});

		// LAST - used in Cards controller & directive
		$scope.templast = false;
		var kurbiGlobal = {};
		kurbiGlobal.templast = false;

		// Symptoms List
		api.getSymptomList($q.defer())
		.then(function(symptoms){
			$scope.symptoms = symptoms;
		});

		// Journal Entries
		journalEntriesSvc.init()
		.then(
			function(data){
//console.log("MAIN CONTROLLER LOAD: ", data);
				if(data[0].today == false){
	                var today = new Date;
	                data.unshift({
	                  date: today.toDateString(),
	                  type: 'groupStart'
	                });
	                $scope.journalEntries = data;
		            if($scope.journalEntries[1].components !== undefined && $scope.journalEntries[1].components.length > 0){
		            	for(component in $scope.journalEntries[1].components){
		            		$scope.journalEntries[1].components[component].id = $scope.journalEntries[1].components[component].details.id;
		            	}
		            }	                
	            }
	            else{
	            	$scope.journalEntries = data;
		            if($scope.journalEntries[0].components !== undefined && $scope.journalEntries[0].components.length > 0){
		            	for(component in $scope.journalEntries[0].components){
		            		$scope.journalEntries[0].components[component].id = $scope.journalEntries[0].components[component].details.id;
		            	}
		            }	            	
	            }
	            $scope.journalEntries = data;
			},
			function(error){
				console.log(error);
			}
		);

		// TOP SYMPTOMS (SIDEBAR)
		api.symptomsObject.initSystemsObject();
		$scope.topSymptomsLimit = 5;
		$scope.topSymptomsOrder = 'count';
		$scope.topDescending = true;
		$scope.topSymptoms = api.symptomsObject.topSymptomsArray;
		$scope.topSeverityColorObj = api.symptomsObject.topSeverityColorObj;
	}

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
console.log($cookies);
console.log(user);
		$state.go('public.logInPage');
	};

	// =====================
	// PAGE SLIDER / FLYOUT
	// =====================
    $rootScope.asideState = {
      open: false
    };
    
    $rootScope.openAside = function(position, backdrop, template) {
      $rootScope.asideState = {
        open: true,
        position: position
      };
      
      function postClose() {
        $rootScope.asideState.open = false;
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
    };

}]);