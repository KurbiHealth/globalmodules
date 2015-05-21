'use strict';

kurbiApp.factory('apiService', ['$resource', '$log', function ($resource, $log) {
	console.log('Post Service');
	var postObj = {
		currentID: 0
	};
	var currentUser = {};
	var friendsEvents = [];
	var friendsEventLists = [];
	var friendsList = [];
	var friendsHashTable = {};

	var resource = $resource('/data/event/:id', {id:'@id'}, {'getAll': {method: 'GET', isArray:true}});
	var authResource = $resource('/data/users/:userName', {userName:'@userName'});

	return {
		getEvent: function (eventid) {
			return resource.get({id:eventid});
		},
		save: function(event) {
			return resource.save(event);
		},
		setCurrentId: function(value) {
			console.log('Service Set CID: ', postObj.currentID);
			postObj.currentID = value;
		},
		getCurrentId: function() {
			console.log('Service CID Returned: ', postObj.currentID);
			return postObj.currentID;
		},
		getAllEvents: function() {
			console.log("Get All Events");
			return resource.query();
		},
		getUser: function(usrNm) {
			return authResource.get({userName:usrNm});
		},
		setCurrentUser: function(user) {
			currentUser = user;
		},
		getCurrentUser: function() {
			return currentUser;
		},
		getFriendsEvents: function() {
			return friendsEvents;
		},
		getFriendEventLists: function() {
			return friendsEventLists;
		},
		setFriendsEvents: function(friends) {
			resource.query().$promise.then(function (response) {
				var fel = [];
				var fe = [];
				var el = [];

				angular.forEach(response, function(value, key) {
					console.log("Resource: ", value);
					if (value.userName != currentUser.userName) {
						angular.forEach(friends, function(f, i) {
							console.log("friend: ", f);
							if (f == value.userName) {
								angular.forEach(value.eventList, function(v, k) {
									console.log("Value: ", v);
							  		this.push(v);
							  		el.push(v);
								}, fel);
								fe.push(value);
								friendsHashTable[value.userName] = el;
								el = [];
							}
							
						});
					}
					else {
						fe.push(value);
						angular.forEach(value.eventList, function(v, k) {
							console.log("Value: ", v);
							this.push(v);
						}, fel);
					}
					
				});
				friendsEventLists = fel;
				friendsEvents = fe;
				console.log("Event Lists: ", friendsEventLists);
				console.log("Friends Events: ", friendsEvents);
				console.log("Hash Table: ", friendsHashTable);
			});
		},
		getFriendId: function(userName) {
			console.log("Get Friend Id of: ", userName);
			for (var i = 0; i < friendsEvents.length; i++) {
				console.log("Friends events: ", friendsEvents[i]);
				if (userName.localeCompare(friendsEvents[i].userName) == 0) {
					console.log("TRUE");
					return friendsEvents[i].id;
				}
			}
		},
		getFriendHashTable: function() {
			return friendsHashTable;
		}
	};
}]);