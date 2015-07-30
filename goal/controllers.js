kurbiApp.controller('GoalController', ['$scope','$rootScope','api','$q',
function ($scope,$rootScope,api,$q) {

console.log('in GoalController');

	this.goal = {};
	if(typeof $scope.goalsList == 'undefined'){
		$scope.goalsList = [];
	}
	var that = this;

	$scope.goalsInit = function(){
		api.goalsInit().then(function(data){
			$scope.goals = data;
		});
	}

	$scope.addGoal = function() {
		// get form values
		var temp = that.goal;

		// save to global array for goals (used in sidebar)
		$scope.goalsList.push(that.goal);

		// save to database
		// 1. add a 'goals' record
		var addGoal = api.addRecord($q.defer(),'goals',{
			name: that.goal.body,
			goal_activity_id: that.goal.activity
		});
		addGoal.then(function(data){
			that.tempId = data.insertId;
		});

		// 2. use new id from 'goals' to add a 'goals_actions' record
		$q.all([addGoal]).then(function(){
			var addGoalAction = api.addRecord($q.defer(),'goals_actions',{
				name: that.goal.action,
				goal_id: that.tempId,
				frequency: that.goal.frequency
			});
			addGoalAction.then(function(){
				console.log('done');
			});
		});
		
		// close the page slider
		$scope.$parent.$close();
	};

}]);