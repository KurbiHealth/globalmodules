// GLOBAL USER OBJECT
// this should build on top of api, so token, userEml, and userPass
// should go in api

kurbiApp.factory('user', [function () {

	// set up core configurations (root url, etc)
<<<<<<< HEAD
	loggedIn 	= true;
	eml 		= 'matteckman@gmail.com';
	firstName 	= 'Matt';
	lastName 	= 'Eckman';
	id 			= 1;
	token 		= '92bac9c4bccfbc1aba229896e05d12facf9455cf6e5b4d67e76e634184c539840871a5a39dc58e7719426678990008a6';
	password 	= 'argentina';
=======
	
/*	loggedIn 	= false;
	email 		= 'matteckman@gmail.com';
	firstName 	= 'Matt';
	lastName 	= 'Eckman';
	id 			= 1;
	token 		= '613623aa358e466e19f0e899509d0367b9e3acd6c5e494547346db2356bfb674232b6b145aee27139bf9607bdea7c3c7';
	password 	= 'argentina'; */

	loggedIn 	= false;
	email 		= '';
	firstName 	= '';
	lastName 	= '';
	id 			= 0;
	token 		= '';
	password 	= '';
>>>>>>> 9559f80cb8c680fe157006e4164960f13633a8b0

	return {

		firstName: firstName,
		lastName: lastName,
		id: id,
		loggedIn: true,
		email: email,
		token: token,
		password: password,
		loggedIn: loggedIn

	}

}]);