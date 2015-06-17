/* Directives */

var journalDirectives = angular.module('journalDirectives', []);

// Main 
journalDirectives.directive('journal-list', function(){
	return {
		restrict: 'A',
		templateUrl: '/modules/journal/templates/entry-list.html'
	};
});

// Add post
journalDirectives.directive('add-post', function() {
	return {
		restrict: 'A',
		templateUrl: '/modules/journal/templates/add-entry.html',
		controller: 'JournalController'
	};
});