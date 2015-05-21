/* Directives */

var postDirectives = angular.module('postDirectives', []);

// Main 
postDirectives.directive('postList', function(){
	return {
		restrict: 'A',
		templateUrl: '/modules/feed/templates/post-list.html'
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

// Post details
postDirectives.directive('postDetail', function() {
	return {
		restrict: 'A',
		templateUrl: './modules/feed/templates/post-detail.html'
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