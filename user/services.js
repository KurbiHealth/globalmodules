// GLOBAL USER OBJECT

kurbiApp.factory('user', ['$cookies','$http','config','$q','$state','$window',
function ($cookies,$http,config,$q,$state,$window){

	var userObj = {

		authenticated: function(){
			var promise = $q.defer();
			if(typeof config.apiUrl != 'undefined' && config.apiUrl != ''){
				var urlRoot = config.apiUrl;
				$cookies.apiUrl = config.apiUrl;
			}else{
				if(typeof $cookies.apiUrl != 'undefined' && $cookies.apiUrl != ''){
					var urlRoot = $cookies.apiUrl;
				}else{
					promise.reject('could not access api due to blank url');
				}
			}

			// check that token is ok
			if($cookies.token != '' && $cookies.email != ''){
				var email = $cookies.email;
				var token = $cookies.token;
				config = {
					method: 'GET',
					url: urlRoot + 'checktoken/',
					headers: {
						'x-custom-username': email,
						'x-custom-token': token
					},
					data: {}
				}
				
				$http(config)
				.success(function(data){
					promise.resolve(data); 
				})
				.error(function(error){
					console.log(error);
					promise.reject(error);
				});
			}else{
				promise.reject('no token found locally');
			}


			return( promise.promise );
		},

		logIn: function(user){
			if(!user){
				// user service not available, means this needs to fail
				// TODO add a flash message to appear to user
				$state.go('public.logInPage');
			}else{		
				// set values in cookie
				$cookies.email = user.email;
				$cookies.firstName = user.first_name;
				$cookies.lastName = user.last_name;
				$cookies.id = user.id.toString();
				$cookies.imageFileName = user.image_file_name;
				$cookies.token = user.auth_token;
				$cookies.loggedIn = 'true';

				// redirect to home
				$state.go('private.journal');
			}
		},

		get: function(key){
			if(typeof $cookies[key] != 'undefined')
				return $cookies[key];
			else
				return false;
		},

		logOut: function(){
			$cookies = {};
console.log($cookies);
			$state.go('public.logInPage');
		},

	}

	return userObj;

}]);