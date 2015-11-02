// GLOBAL USER OBJECT
// this should build on top of api, so token, userEml, and userPass
// should go in api

kurbiApp.factory('user', ['$cookies', function ($cookies) {

	loggedIn 		= false;
	email 			= '';
	firstName 		= '';
	lastName 		= '';
	id 				= '';
	imageFileName 	= '';
	token 			= '';

	return {

		firstName: firstName,
		lastName: lastName,
		id: id,
		email: email,
		token: token,
		loggedIn: loggedIn,
		imageFileName: imageFileName,
		// functions
		saveUser: saveUser,
		getUser: getUser,
		setToken: setToken

	}

	function saveUser(user){
		// set local values
		this.email = user.email;
		this.firstName = user.first_name;
		this.lastName = user.last_name;
		this.id = user.id;
		this.imageFileName = user.image_file_name;

		// set values in cookie
		$cookies.userEmail = this.email;
		$cookies.userFirstName = this.firstName;
		$cookies.userLastName = this.lastName;
		$cookies.userId = this.id.toString();
		$cookies.imageFileName = this.imageFileName;
	}

	function getUser(){
		var tempObj = {
			'email': 		'',
			'firstName': 	'',
			'lastName': 	'',
			'id': 			'',
			'token': 		'',
			'imageFileName':''
		};

		// Email
		if(this.email != ''){
			tempObj.email = this.email;
		}else{
			tempObj.email = this.email = $cookies.userEmail;
		}
		// First Name
		if(this.firstName != ''){
			tempObj.firstName = this.firstName;
		}else{
			tempObj.firstName = this.firstName = $cookies.userFirstName;
		}
		// Last Name
		if(this.lastName != ''){
			tempObj.lastName = this.lastName;
		}else{
			tempObj.lastName = this.lastName = $cookies.userLastName;
		}
		// User ID
		if(this.id != ''){
			tempObj.id = this.id;
		}else{
			tempObj.id = this.id = $cookies.userId;
		}
		// Token
		if(this.token != ''){
			tempObj.token = this.token;
		}else{
			tempObj.token = this.token = $cookies.token;
		}
		// Image File Name
		if(this.imageFileName != ''){
			tempObj.imageFileName = this.imageFileName;
		}else{
			tempObj.imageFileName = this.imageFileName = $cookies.imageFileName;
		}

		return tempObj;
	}

	function setToken(token){
		this.token = token;
		$cookies.token = token;
	}

}]);