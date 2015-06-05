kurbiApp.controller('LoginController', ['$state', '$scope', '$q', 'api', 'user', 
function ($state, $scope, $q, api, user) {

	$scope.login = function(){
		promise = $q.defer();
		result = api.logIn(promise,$scope.loginEmail,$scope.loginPassword);
		
		// add values to user service
		if(user){
			user.email = result.email;

			// redirect to home
			$state.go('/app/home');
		}else{

		}
	};

}]);