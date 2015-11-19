kurbiApp.controller('LoginController', ['$location', '$scope', '$q', 'api', 'user', '$state',
function ($location, $scope, $q, api, user, $state) {

	$scope.login = function(){
		promise = $q.defer();
		api.logIn(promise,$scope.email,
			$scope.password).then(
			function(result){
				// add values to user service
				if(user){
					user.saveUser(result.user);
					user.loggedIn = true;
					user.setToken(result.token);
					// redirect to home
					$state.go('private.home'); 
				}else{
					// user service not available, means this needs to fail
					// TODO add a flash message to appear to user
					$state.go('public.logInPage');
				}
			} 
		);

	};

}]);