/* Directives */

var loginDirectives = angular.module('postDirectives', []);

// Login Form
loginDirectives.directive('loginForm', function() {
	return {
		restrict: 'A',
		templateUrl: '/modules/login/templates/login-form.html',
		controller: 'LoginController'
	};
});