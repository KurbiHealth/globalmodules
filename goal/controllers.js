kurbiApp.controller('GoalController', ['$scope','$rootScope','api',
	'$q','$state','user',
function ($scope,$rootScope,api,$q,$state,user) {

	// FLYOUT - ACTIVITIES FORM

	$scope.getGoalActivityId = function(activity){
		$rootScope.currentGoalActivity = activity;
		$rootScope.openAside('right',true,'modules/goal/templates/add-path.html');
	};

	// FLYOUT - SAVE GOAL AND/OR PATH

	$scope.goal = {};
	$scope.currentGoalId = '';
	$scope.currentPathId = '';
	$scope.path = {
		name: '',
		overview: '',
		fullDescription: '',
		pathSteps: [],
		backgroundImage: '',
		location: '',
		frequency: '',
		toolkitItems: [],
	};
	$scope.path.toolkitItems.push('');
	$scope.path.pathSteps.push('');

	$scope.addGoal = function(goal) {
		
		// save to database
		var addGoal = api.addRecord($q.defer(),'goals',{
			name: goal.name,
			goal_activity_id: $rootScope.currentGoalActivity.id
		})
		.then(function(data){
			$scope.currentGoalId = data.insertId;
			// save to global array for goals (used in sidebar)
			goal.id = data.insertId;
			$rootScope.goalsList.push(goal);
			// close the page slider
			$scope.$parent.$close();
			// reload the page to show the new goal
			$state.reload();
		});

	};

	$scope.addToolkitItem = function(){
		$scope.path.toolkitItems.push('');
	}

	$scope.addPathStep = function(){
		$scope.path.pathSteps.push('');
	}

	$scope.addPath = function(path){

		var nextStage = [];
	// 1. save the goal
		api.addRecord($q.defer(),'goals',{
			name: $scope.goal.name,
			goal_activity_id: $rootScope.currentGoalActivity.id
		})
		.then(function(data){
			$scope.currentGoalId = data.insertId;
			$scope.goal.id = data.insertId;

	// 2. use new id from 'goals' to add a 'paths' record
			user.getUser();
			api.addRecord($q.defer(),'paths',{
				name: path.name,
				user_id: Number(user.id),
				goal_id: $scope.currentGoalId,
				overview: path.overview,
				full_description: path.fullDescription,
				background_image: path.backgroundImage.name,
				location: path.location,
				weekly_frequency: path.frequency
			})
			.then(function(data){
				$scope.currentPathId = data.insertId;

	// 3. add paths_steps
				for(j in path.pathSteps){
					nextStage.push(
						api.addRecord($q.defer(),'path_steps',{
							name: path.pathSteps[j],
							path_id: $scope.currentPathId,
						})
						.then(function(data){
						})
					);
				}

	// 4. add path_toolkit_items
				for(j in path.toolkitItems){
					nextStage.push(
						api.addRecord($q.defer(),'path_toolkit_items',{
							name: path.toolkitItems[j],
							path_id: $scope.currentPathId,
						})
						.then(function(data){
						})
					);
				}
			});
		});

		$q.all(nextStage)
		.then(function(){
			// close the page slider
			$scope.$parent.$close();
			// save to global array for goals (used in sidebar)
			$rootScope.goalsList.push($scope.goal);
			// reload the page to show the new goal
			$state.reload();
		});

	}

}]);