kurbiApp.controller('GoalController', ['$scope','$rootScope', 
function ($scope,$rootScope) {

console.log('in GoalController');

	this.goal = {};

	this.addGoal = function() {
		goal.push(this.goal);
		this.goal = {
			category: $scope.category,
			body: $scope.body
		};
		$scope.category = '';
		$scope.body = '';
	};

}]);