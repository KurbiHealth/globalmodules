kurbiApp.controller('PostController', ['$scope', '$q', 'posts', 'api', 'user', 
function ($scope, $q, posts, api, user) {

console.log('in PostController');

	$scope.currentTime = new Date();
	$scope.limit = -3;

	$scope.addPost = function(){
		newPost = {
			user_id: user.id,
			type: 'post',
			text: $scope.message,
			likes: 0
		};
		promise = $q.defer();
		newId = api.addRecord(promise,'messages',newPost);
		$scope.posts.push({
			id: newId,
			author: user.firstName + ' ' + user.lastName,
			message: $scope.message,
			likes: 0,
			comments: []
		});
		$scope.message = '';
	};

	$scope.incrementLikes = function(post) {
		post.likes += 1;
	};
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