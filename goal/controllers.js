kurbiApp.controller('GoalController', ['$scope','$rootScope','api',
	'$q','$state','user','cloudinary',
function ($scope,$rootScope,api,$q,$state,user,cloudinary) {


	// SET UP VARIABLES

	$scope.goal = {};
	$scope.currentGoalId = '';
	$scope.goal = {
		name: '',
		activity_id: ''
	};
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


	// FLYOUT - ACTIVITIES FORM

	$scope.getGoalActivityId = function(activity){
		$rootScope.currentGoalActivity = activity;
		$scope.$parent.$close();
		$rootScope.openAside('right',true,'modules/goal/templates/add-path.html');
	};


	// FLYOUT - SAVE GOAL AND/OR PATH

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
			api.addRecord($q.defer(),'paths',{
				name: path.name,
				user_id: Number(user.get('id')),
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

	// 5. add the background image
				/*cloudinary.upload(path.backgroundImage, {})
				.then(function (resp) {
					nextStage.push(
						api.addRecord($q.defer(),'path_toolkit_items',{
							name: path.toolkitItems[j],
							path_id: $scope.currentPathId,
						})
						.then(function(data){
						})
					);					
				}); */
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

	$scope.loadGoalPath = function(goalId){

/* TODO'S
- Need to change the order of loading around to pull goal and then all paths for that goal
- need to add a many2many table between goals and paths in db
- need to add that m2m tbl info to join and validModels files in the api
- need to modify the addPath to accomodate
- need to add an ng-repeat that spits out an accordion section for each path, then fills out a 
path display (with an edit button) for each path
*/

		$scope.currentPathId = pathId;
		$scope.tempPath = {
			name: '',
			overview: '',
			fullDescription: '',
			pathSteps: [],
			backgroundImage: '',
			location: '',
			frequency: '',
			toolkitItems: [],
		};

		// load path
		var nextStep = [];
		api.getOne($q.defer(),'paths',pathId)
		.then(function(data){ 
			$scope.tempPath.name = data.name;

			nextStep.push(
				api.getOne($q.defer(),'goals',data.goal_id)
				.then(function(data){
					$scope.currentGoalId = data.id;
					$scope.goal.name = data.name;
					$scope.goal.activity_id = data.activity_id;
					nextStep.push(
						api.getOne($q.defer(),'goal_activities',data.activity_id)
						.then(function(data){
							$scope.goal.activity_name = data.name;
						})
					);
				})
			);

			nextStep.push(
				api.query($q.defer(),'path_steps',{
					field: 'path_steps.path_id|eq|' + pathId
				})
				.then(function(data){
					$scope.tempPath.pathSteps = data;
				})
			);

			nextStep.push(
				api.query($q.defer(),'path_toolkit_items',{
					field: 'path_toolkit_items.path_id|eq|' + pathId
				})
				.then(function(data){
					$scope.tempPath.toolkitItems = data;
				})
			);

			$q.all(nextStep)
			.then(function(){
				$scope.path = $scope.tempPath;
			});
		});

	}

}]);