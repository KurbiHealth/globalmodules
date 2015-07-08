kurbiApp.controller('GoalController', ['$scope', function ($scope) {

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