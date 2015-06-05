// GLOBAL USER OBJECT
// this should build on top of api, so token, userEml, and userPass
// should go in api

kurbiApp.factory('user', ['api', function (api) {

	// set up core configurations (root url, etc)
	loggedIn 	= false;
	eml 		= 'matteckman@gmail.com';
	firstName 	= 'Matt';
	lastName 	= 'Eckman';
	id 			= 1;
	token 		= '613623aa358e466e19f0e899509d0367b9e3acd6c5e494547346db2356bfb674232b6b145aee27139bf9607bdea7c3c7';
	password 	= 'argentina';

	return {

		firstName: firstName,
		lastName: lastName,
		id: id,
		loggedIn: true,
		email: eml,
		token: token,
		password: password,
		loggedIn: loggedIn

	}

}]);