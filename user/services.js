// GLOBAL USER OBJECT
// this should build on top of api, so token, userEml, and userPass
// should go in api

kurbiApp.factory('user', ['api', function (api) {

	// set up core configurations (root url, etc)
	loggedIn = true;
	eml = 'matteckman@gmail.com';
	firstName = 'Matt';
	lastName = 'Eckman';
	id = 1;

	return {

		firstName: firstName,
		lastName: lastName,
		id: id,
		loggedIn: true,
		email: eml

	}

}]);