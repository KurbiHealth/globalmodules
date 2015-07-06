// GLOBAL USER OBJECT
// this should build on top of api, so token, userEml, and userPass
// should go in api

kurbiApp.factory('user', ['api', function (api) {

	// set up core configurations (root url, etc)
	loggedIn 	= true;
	eml 		= 'matteckman@gmail.com';
	firstName 	= 'Matt';
	lastName 	= 'Eckman';
	id 			= 1;
	token 		= '92bac9c4bccfbc1aba229896e05d12facf9455cf6e5b4d67e76e634184c539840871a5a39dc58e7719426678990008a6';
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