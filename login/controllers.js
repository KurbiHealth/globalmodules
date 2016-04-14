kurbiApp.controller('LoginController', ['$location', '$scope', '$q', 'api', 'user', '$state',
function ($location, $scope, $q, api, user, $state) {

	$scope.loginFormFields = {};

	$scope.login = function(){
		promise = $q.defer();
		api.logIn(promise,$scope.loginFormFields.email,
			$scope.loginFormFields.password).then(
			function(result){
				user.logIn(result.user);
			}
		);
	};

}]);