/* Directives */

var postDirectives = angular.module('postDirectives', []);

// Main 
postDirectives.directive('postList', function(){
	return {
		restrict: 'A',
		templateUrl: '/modules/feed/templates/post-list.html',
		controller: 'PostController',
		link: function(scope, element, attr, ctrl){  }
	};
});

// Add post
postDirectives.directive('addPost', function() {
	return {
		restrict: 'A',
		templateUrl: '/modules/feed/templates/add-post.html',
		controller: 'PostController'
	};
});

// Add comment
postDirectives.directive('commentDetail', function() {
	return {
		restrict: 'A',
		templateUrl: '/modules/feed/templates/comment-detail.html'
	};
});

// Comment details
postDirectives.directive('addComment', function() {
	return {
		restrict: 'A',
		templateUrl: '/modules/feed/templates/add-comment.html',
		controller: 'CommentController'
	};
});