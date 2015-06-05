/* Directives */

var journalDirectives = angular.module('journalDirectives', []);

// Main 
journalDirectives.directive('journalList', function(){
	return {
		restrict: 'A',
		templateUrl: '/modules/journal/templates/entry-list.html'
	};
});

// Add post
journalDirectives.directive('addPost', function() {
	return {
		restrict: 'A',
		templateUrl: '/modules/journal/templates/add-entry.html',
		controller: 'JournalController'
	};
});