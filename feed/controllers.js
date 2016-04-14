kurbiApp.controller('PostController', ['$scope', '$q', 'posts', 'api', 
	'user', '$rootScope', '$timeout',
function ($scope, $q, posts, api, user, $rootScope, $timeout) {

	$scope.addPost = function(){
		newPost = {
			user_id: user.get('id'),
			type: 'post',
			text: $scope.message,
			likes: 0
		};
		promise = $q.defer();
		newId = api.addRecord(promise,'messages',newPost);
		$scope.feed.push({
			id: newId,
			author: user.get('firstName') + ' ' + user.get('lastName'),
			message: $scope.message,
			likes: 0,
			comments: []
		});
		$scope.message = '';

		// update the masonry grid layout
		$timeout(function(){
			$('.journal-day').masonry('reloadItems');
			$('.journal-day').masonry('layout');
		},100);
	};

	$scope.incrementLikes = function(post) {
		post.likes += 1;
	};

	$scope.$on('allRendered', function(){
		// the "allRendered" event is supposed to broadcast when the 
		// cards are done being rendered, but there still is a brief
		// time between when the directive is done rendering and when
		// the Masonry will work, hence the $timeout
		$timeout(function(){
			$('.journal-day').masonry({
				itemSelector: '.card',
				//columnWidth: 280,
				isFitWidth: true,
				//stamp: '.journal-day-header'
			});
		},450);
	});

}]);

kurbiApp.controller('CommentController', ['$scope', 'posts', function ($scope, posts) {

	$scope.currentTime = new Date();
	$scope.currentID = 1;

	this.comment = {
		id: $scope.currentID++,
		author: "Steve Roettger",
		published: $scope.currentTime,
		likes: 0
	};

	this.addComment = function(post) {
		post.comments.push(this.comment);
		this.comment = {
			id: $scope.currentID++,
			author: "Steve Roettger",
			published: $scope.currentTime,
			likes: 0
		};
	};

	$scope.incrementLikes = function(comment) {
		comment.likes += 1;
	};

}]);