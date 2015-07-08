// GLOBAL USER OBJECT
// this should build on top of api, so token, userEml, and userPass
// should go in api

kurbiApp.factory('user', ['$cookies', function ($cookies) {

	loggedIn 	= false;
	email 		= '';
	firstName 	= '';
	lastName 	= '';
	id 			= 0;
	token 		= '';

	return {

		firstName: firstName,
		lastName: lastName,
		id: id,
		email: email,
		token: token,
		loggedIn: loggedIn,
		setToken: setToken,
		saveUser: saveUser,
		getUser: getUser

	}

	function saveUser(email,firstName,lastName,id){
		// set local values
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
		this.id = id;

		// set values in cookie
		$cookies.userEmail = email;
		$cookies.userFirstName = firstName;
		$cookies.userLastName = lastName;
		$cookies.userId = id;
	}

	function getUser(){
		var tempObj = {
			'email': '',
			'firstName': '',
			'lastName': '',
			'id': '',
			'token': ''
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

		return tempObj;
	}

	function setToken(token){
		this.token = token;
		$cookies.token = token;
	}

}]);