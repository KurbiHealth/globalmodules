/* Directives */

var loginDirectives = angular.module('loginDirectives', []);

// Login Form
loginDirectives.directive('loginForm', function() {
	return {
		restrict: 'AE',
		templateUrl: '/modules/login/templates/login-form.html',
		controller: 'LoginController',
		link: function(){
			console.log('in loginDirectives, loginForm');
		}
	};
});