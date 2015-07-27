// https://docs.angularjs.org/api/ng/service/$http
// NOTE: take a look at the security concerns in documentation

kurbiApp.factory('api', ['$http', '$q', '$log', 'user','config','$state', 
function ($http, $q, $log, user, config, $state) {
	
	// set up core configurations (root url, etc)
	urlRoot = config.apiUrl;

	return {
		// CORE QUERIES
		logIn: logIn,
		signUp: signUp,
		getList: getList,
		getOne: getOne,
		addRecord: addRecord,
		query: query,
		// SPECIAL QUERIES
		postsInit: postsInit,
		careTeamInit: careTeamInit,
		getJournalCards: getJournalCards
	};

	/*------------------------------------------------
	  CORE QUERIES  
	------------------------------------------------*/

	function logIn(promise,userEml,userPass){
		config = {
			method: 'POST',
			url: urlRoot + 'login',
			headers: {},
			data: {
				email: userEml,
				password: userPass
			}
		}

		$http(config)
		.success(function(data){
			promise.resolve(data);
		})
		.error(function(error){
console.log('error in logIn function-api service: ',error);
			if(error == 'Unauthorized'){
				// Redirect user to our login page
    			$state.go('public.logInPage');
			}
		});
		return( promise.promise );
	}

	function signUp(userEmail,userPass,userFirstName,userLastName){
		config = {
			method: 'POST',
			url: urlRoot + 'signup',
			headers: {},
			data: {
				email: userEmail,
				password: userPass,
				firstname: userFirstName,
				lastname: userLastName
			}
		}
		promise = $q.defer();
		$http(config)
		.success(function(data){
			promise.resolve(data);
		})
		.error(function(error){
console.log('error in signUp function-api service: ',error);
			if(error == 'Unauthorized'){
				// Redirect user to our login page
    			$state.go('public.logInPage');
			}
		});
		return( promise.promise );
	}

	function getList(promise,tableName) {
		user.getUser();
		config = {
			method: 'GET',
			url: urlRoot + 'db/' + tableName + '/',
			headers: {
				'x-custom-username': user.email,
				'x-custom-token': user.token
			},
			data: {}
		}
		$http(config)
		.success(function(data){
			promise.resolve(data);
		})
		.error(function(error){
console.log('error in getList function-api service: ',error);
			if(error == 'Unauthorized'){
				// Redirect user to our login page
    			$state.go('public.logInPage');
			}
		});
		return( promise.promise );
	}

	function getOne(promise,tableName,id){
		user.getUser();
		config = {
			method: 'GET',
			url: urlRoot + 'db/' + tableName + '/' + id,
			headers: {
				'x-custom-username': user.email,
				'x-custom-token': user.token
			},
			data: {}
		}
		$http(config)
		.success(function(data){
			promise.resolve(data);
		})
		.error(function(error){
console.log('error in getOne function-api service: ',error);
			if(error == 'Unauthorized'){
				// Redirect user to our login page
    			$state.go('public.logInPage');
			}
		});
		return( promise.promise );
	}

	function addRecord(promise,tableName,obj){
		user.getUser();
		config = {
			method: 'POST',
			url: urlRoot + 'db/' + tableName + '/',
			headers: {
				'x-custom-username': user.email,
				'x-custom-token': user.token
			},
			data: obj
		}
		$http(config)
		.success(function(data){
			promise.resolve(data);
		})
		.error(function(error){
console.log('error in addRecord function-api service: ',error);
			if(error == 'Unauthorized'){
				// Redirect user to our login page
    			$state.go('public.logInPage');
			}
		});
		return( promise.promise );
	}

/**
 * USAGE
 * obj = {
 		// has(LIKE),eq(=),gt(>),lt(<),gteq(>=),lteq(<=)
 * 		field: 'table_name.field_name|eq|value',
 * 		// repeat field: as much as you want
 * 		orderBy: 'table_name.field_name',
 * 		limit: number
 * }
 */
	function query(promise,tableName,obj){
		user.getUser();
		config = {
			method: 'POST',
			url: urlRoot + 'query/' + tableName + '/',
			headers: {
				'x-custom-username': user.email,
				'x-custom-token': user.token
			},
			data: obj
		}
		$http(config)
		.success(function(data){
			promise.resolve(data);
		})
		.error(function(error){
console.log('error in query function-api service: ',error);
			if(error == 'Unauthorized'){
				// Redirect user to our login page
    			$state.go('public.logInPage');
			}
			promise.reject();
		});
		return( promise.promise );
	}

	/*------------------------------------------------
		SPECIAL QUERIES 
	------------------------------------------------*/

	function postsInit($scope){
		tempPosts1 = [];
		tempPosts2 = [];

		promise = $q.defer();
		messageRequest1 = query(promise,'messages',{
			field: 'messages.parent_message_id|eq|0',
			orderBy: 'messages.created|desc' 
		});
		messageRequest1.then(function(data){
			list = [];
			for(i in data){
				temp = {};
				if(data[i].type != 'invitation'){
					// Split timestamp into [ Y, M, D, h, m, s ]
					var t = data[i].messages.created.split(/[- :T]/);
					t[5] = t[5].replace('.000Z', '');
					// Apply each element to the Date function
					var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
					temp.created = d;
					temp.author = user.firstName + ' ' + user.lastName;
					temp.message = data[i].messages.text;
					temp.userId = data[i].messages.user_id;
					temp.messageId = data[i].messages.id;
					list.push(temp);
				}
			}
			tempPosts1 = list;
		});
		messageRequest1.catch(function(error){console.log('error in mainController',error);});

		promise = $q.defer();
		messageRequest2 = query(promise,'message_recipients/messages',{
			//field: 'message_recipients.user_id|eq|' + user.id,
			orderBy: 'messages.created|desc' 
		});
		messageRequest2.then(function(data){
			list = [];
			for (i in data){
				temp = {};
				if(data[i].messages.type != 'invitation'){
					// Split timestamp into [ Y, M, D, h, m, s ]
					var t = data[i].messages.created.split(/[- :T]/);
					t[5] = t[5].replace('.000Z', '');
					// Apply each element to the Date function
					var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
					temp.created = d;
					temp.author = 'Someone Else';
			// get author info by doing query pulling from users where
			// message_recipients.user_id = ???
					temp.message = data[i].messages.text;
					temp.userId = data[i].messages.user_id;
					temp.messageId = data[i].messages.id;
					list.push(temp);
				}
			}
			tempPosts2 = list;
		});

		messageRequest2.catch(function(error){
			console.log('error in mainController, line 86', error);
		});


	    // http://plnkr.co/edit/HehavGo2QXHcZaEhNsDu?p=preview
		// use $q.all to wait until all promises are resolved
		$q.all([
			messageRequest1,
			messageRequest2
		]).then(
			function() {
				// handle success
				temp = tempPosts1.concat(tempPosts2);
				tempComments = [];
				requests = [];
				for(i in temp){
					promise = $q.defer();
					requests.push(query(promise,'messages',
						{
							field: 'messages.parent_message_id|eq|' + temp[i].messageId,
							orderBy: 'messages.created|desc' 
						}).then(
							function(data){
								if(data.length > 0){
									commentList = [];
									parentId = data[0].messages.parent_message_id;
									for(i in data){
										comment = {};
										comment.author = '';
										var t = data[i].messages.created.split(/[- :T]/);
										t[5] = t[5].replace('.000Z', '');
										// Apply each element to the Date function
										var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
										comment.published = d;
										comment.body = data[i].messages.text;
										comment.userId = data[i].messages.user_id;
										commentList.push(comment);
									}
									tempComments[parentId] = commentList;
								}
							}
						).catch(function(error){
							console.log('error in mainController, line 97',error);
						})
					);
				}			
				$q.all(requests).then(function(){
					for(i in temp){
						if(temp[i].messageId in tempComments)
							temp[i].comments = tempComments[temp[i].messageId];
						else
							temp[i].comments = [];
					}
					$scope.posts = temp;
				});
			},
			function (error) {
				// handle errors here
				console.log('error in mainController, line 105', error);
				return error;
			}
		);
	}

	function careTeamInit(){
		returnPromise = $q.defer();
		queryPromise = $q.defer();
		careTeamRequest = query(queryPromise,'care_teams/care_team_members/users',{
			field: 'care_teams.user_id|eq|' + user.id,
		});
		careTeamRequest.then(function(data){
			list = [];
			for(i in data){
				tempUser = {};
				// Split timestamp into [ Y, M, D, h, m, s ]
				var t = data[i].care_team_members.created.split(/[- :T]/);
				t[5] = t[5].replace('.000Z', '');
				// Apply each element to the Date function
				var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
				tempUser.joined = d;
				tempUser.firstName = data[i].users.first_name;
				tempUser.lastName = data[i].users.last_name;
				tempUser.avatar = data[i].users.image_file_name;
				tempUser.bio = data[i].users.bio;
				tempUser.role = data[i].care_team_members.role;
				tempUser.userId = data[i].users.id; 

				list.push(tempUser);
			} 
			returnPromise.resolve(list);
		});
		careTeamRequest.catch(function(error){
			console.log('error in mainController',error);
		});

		return returnPromise.promise;
	}

	function getJournalCards(returnPromise,date){
// journal_entries
//	  "id","date","note","wellness_score","user_id","created"
// journal_entry_components
//    "id","severity","symptom_id","note_id","journal_entry_id",
//    "date","created"
// notes
//    "id","text","created"
// symptoms
//    "id","technical_name","colloquial_name","description",
//    "long_description","symptom_category_id","disease_id",
//    "disease_condition_symptom_id","created"
// NOTE: need to add a table for images (?)

		// LOAD FOR 'date' OR FIRST RECORD OLDER THEN 'date'
		var dateString = '-';
		if(date == null || date == ''){
			query($q.defer(),'journal_entries',{
				orderBy: 'journal_entries.created|asc',
				limit: 1
			}).then(
				function(data){
					dateString = data[0].journal_entries.created.substr(0,10);console.log(dateString);
				},
				function(error){
					console.log('error in api (service) line 378', error);
				}
			);
		}else{
			// Check whether there are entries for 'date', otherwise bring back the earliest day before 'date'
			query($q.defer,'journal_entries',{
				field: 'journal_entries.created|has|' + date
			}).then(
				function(data){
					if(data == null){
						query($q.defer,'journal_entries',{
							field: 'journal_entries.created|gt|'+date,
							limit: 1
						}).then(
							function(data){console.log('line 392');
								dateString = data[0].journal_entries.created.substr(0,10);
							},
							function(error){
								console.log('error in api (service) line 396', error);
							}
						);
					}
				},
				function(error){
					console.log('error in api (service) line 402', error);
				}
			);
		}	
console.log(dateString);
		// GET THE ENTRIES FOR A DAY
		user.getUser();
		if(dateString != ''){
			query($q.defer(),'journal_entries',{
				field: 'journal_entries.created|has|'+dateString,
				orderBy: 'journal_entries.created|asc'
			});
		}else{
			console.log('error with dateString: ',dateString);
		}

		// get all for a day
/*		journalEntries.then(function(data){
			var list = [];
			for(i in data){
				var journalEntry = {};
				var t = data[i].journal_entries.created.split(/[- :T]/);
				t[5] = t[5].replace('.000Z', '');
				// Apply each element to the Date function
				var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
				journalEntry.date = d;

journalEntry.components = [
	{id: 1, type: 'image-card', title: 'My vacation'},
];

				// get journal_entry_components for entry
				queryPromise2 = $q.defer();
				components = query(queryPromise2,'journal_entry_components/journal_entries',{
					field: 'journal_entry_components.journal_entry_id|eq|' + data[i].id
				});
				components.then(function(data2){
//console.log(data2);
					
				});
				list.push(journalEntry);
			}
console.log(list);
			returnPromise.resolve(list);
		});
		journalEntries.catch(function(error){
			console.log('error in api (service) - getJournalCards()',error);
		});
*/
		return returnPromise.promise;
	}

}]);