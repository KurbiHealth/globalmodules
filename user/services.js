// GLOBAL USER OBJECT

kurbiApp.factory('user', ['$cookies', function ($cookies) {

	var userObj = {

		loggedIn: undefined,
		email: 			'',
		firstName: 		'',
		lastName: 		'',
		id: 			'',
		imageFileName: 	'',
		token: 			'',

		saveUser: function(user){
			// set local values
			this.email = user.email;
			this.firstName = user.first_name;
			this.lastName = user.last_name;
			this.id = user.id;
			this.imageFileName = user.image_file_name;
			this.loggedIn = true;

			// set values in cookie
			$cookies.userEmail = this.email;
			$cookies.userFirstName = this.firstName;
			$cookies.userLastName = this.lastName;
			$cookies.userId = this.id.toString();
			$cookies.imageFileName = this.imageFileName;
			$cookies.loggedIn = 'true';
		},

		getUser: function(){
			// Email
			if(this.email == '' || typeof this.email == 'undefined'){
				this.email = $cookies.userEmail;
			}
			// First Name
			if(this.firstName == '' || typeof this.firstName == 'undefined'){
				this.firstName = $cookies.userFirstName;
			}
			// Last Name
			if(this.lastName == '' || typeof this.lastName == 'undefined'){
				this.lastName = $cookies.userLastName;
			}
			// User ID
			if(this.id == '' || typeof this.id == 'undefined'){
				this.id = $cookies.userId;
			}
			// Token
			if(this.token === '' || typeof this.token === 'undefined'){
				this.token = $cookies.token;
			}
			// Image File Name
			if(this.imageFileName === '' || typeof this.imageFileName === 'undefined'){
				this.imageFileName = $cookies.imageFileName;
			}
			// Logged In
			if(this.loggedIn === '' || typeof this.loggedIn === 'undefined'){
				if($cookies.loggedIn == 'true')
					this.loggedIn = true;
				else
					this.loggedIn = false;
			}
		},

		setToken: function(token){
			this.token = token;
			$cookies.token = token;
		}

	}

	return userObj;

}]);