kurbiApp.controller('LoginController', ['$location', '$scope', '$q', 'api', 'user', 
function ($location, $scope, $q, api, user) {

	$scope.login = function(){
console.log('in login controller');
		promise = $q.defer();
		api.logIn(promise,$scope.email,
			$scope.password).then(
			function(result){
				// add values to user service
				if(user){
					user.email = result.user.email;
					user.loggedIn = true;
					user.firstName = result.user.first_name;
					user.lastName = result.user.last_name;
					user.id = result.user.id;
					user.token = result.token;
					user.password = result.user.password;
			$scope.$apply;

/*$scope.$watch(function () { return uaProgressService.taskList }, function (newVal, oldVal) {
    if (typeof newVal !== 'undefined') {
        $scope.taskList = uaProgressService.taskList;
    }
});*/

					// redirect to home
					$location.path('/app/home');
				}else{
					// user service not available, means this needs to fail

				}
			});
	};

}]);