// https://docs.angularjs.org/api/ng/service/$http
// NOTE: take a look at the security concerns in documentation

kurbiApp.factory('api', ['$http', '$q', '$log', 'user',
	'config','$state', 
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
		getJournalCards: getJournalCards,
		goalsInit: goalsInit,
		liveChartList: liveChartList,
		addSymptom: addSymptom,
		getSymptomList: getSymptomList
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

	function updateOne(promise,tableName,obj,id){
		user.getUser();
		config = {
			method: 'PUT',
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
		HELPER FUNCTIONS
	------------------------------------------------*/

	function _fixTimestamp(date){
		// The datetime value in the database is off because the 
		// db is set to a different timezone then EST, so rather
		// then try and change the db, I set up this function to
		// fix the time, as a temporary fix
		var t = date.split(/[- :T]/);
		t[5] = t[5].replace('.000Z', '');
		var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
		var tz_offset = d.getTimezoneOffset() * 60 * 1000;
		var corrected_datetime = new Date(d - tz_offset);
		return corrected_datetime;
	}

	function _fixChartDate(date){
		if(date != '' && date != null || date != ' '){
			var t = date.split(/[-\/ :T]/);
			var d = new Date(t[0], t[1]-1, t[2]);
			//var tz_offset = d.getTimezoneOffset() * 60 * 1000;
			//var corrected_datetime = new Date(d - tz_offset);
			return d;
		}else{
			return null;
		}
	}

	function _getStringDate(d){
		// this converts a Time object into a y/m/d string
		// that can be used in a mysql sql query
		var month = d.getMonth() + 1;
		var day = d.getDate();
		if(day < 10)
			var day = '0' + day;
		if(month < 10)
			var month = '0' + month;
		var r = d.getFullYear() + '-' + month + '-' + day;
		return r;
	}

	/*------------------------------------------------
		SPECIAL QUERIES 
	------------------------------------------------*/

	function postsInit($scope,careTeam){
		tempPosts1 = [];
		tempPosts2 = [];

		user.getUser();

		promise = $q.defer();
		messageRequest1 = query(promise,'messages',{
			field: 'messages.parent_message_id|eq|0',
			orderBy: 'messages.created|desc' 
		});
		messageRequest1.then(function(data){
			list = [];
			for(i in data){
				temp = {};
				if(data[i].messages.type != 'invitation'){
					// Split timestamp into [ Y, M, D, h, m, s ]
					var t = data[i].messages.created.split(/[- :T]/);
					t[5] = t[5].replace('.000Z', '');
					// Apply each element to the Date function
					var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
					temp.type = 'post-card';
					temp.created = d;
					temp.message = data[i].messages.text;
					temp.userId = data[i].messages.user_id;
					temp.messageId = data[i].messages.id;
					// MATCH UP USER DATA FOR THE MESSAGE
					var uid = data[i].messages.user_id;
					if(user.id == uid.toString()){
						temp.author = user.firstName + ' ' + user.lastName;
						temp.avatar = '/design/user_images/' + user.imageFileName;
					}else{
						for(i in careTeam){
							if(careTeam[i].userId == uid){
								temp.avatar = '/design/user_images/' + careTeam[i].image_file_name;
							}else{
								temp.avatar = '';
							}
						}
					}
					// ADD TO LIST
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
		messageRequest2.then(function(data2){
			list = [];
			for (i in data2){
				temp = {};
				if(data2[i].messages.type != 'invitation'){
					// Split timestamp into [ Y, M, D, h, m, s ]
					var t = data2[i].messages.created.split(/[- :T]/);
					t[5] = t[5].replace('.000Z', '');
					// Apply each element to the Date function
					var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
					temp.type = 'post-card';
					temp.created = d;
					temp.author = 'Someone Else';
					temp.message = data2[i].messages.text;
					temp.userId = data2[i].messages.user_id;
					// MATCH UP USER DATA FOR THE MESSAGE
					var uid = data2[i].messages.user_id;
					
					temp.avatar = '';
					for(j in careTeam){
						if(careTeam[j].userId == uid){
							temp.avatar = '/design/user_images/' + careTeam[j].image_file_name;
						}
					}
					temp.messageId = data2[i].messages.id;
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
	//_getSymptoms();
					$scope.feed = temp;
				});
			},
			function (error) {
				// handle errors here
				console.log('error in mainController, line 105', error);
				return error;
			}
		);
	}

	function _getSymptoms(){
		var that = this;
		that.componentsList = [];
		// get all symptoms from journal_entry_components where
		// symptom_id != null/''

		// go through each one and 
		var components = [];
		var details = [];
		promise = $q.defer();
		components.push(query(promise,'journal_entry_components/journal_entries',{
			field: 'journal_entry_components.symptom_id|eq|' + data[i].journal_entries.id
		}).then(function(componentsData){
console.log(componentsData);
			for(j in componentsData){

				details.push(getOne(promise,'symptoms',data[i].symptom_id)
				.then(function(detail){
					// add detail to the component
					that.tempComp = {
						id: '',
						type: '',
						title: '',
						details: {}
					};
					that.tempComp.type = 'symptom-card';
					that.tempComp.id = data[i].id;
					that.tempComp.details = detail.symptoms;
					that.tempComp.details.severity = data[i].severity;
					that.tempComp.severity = data[i].severity;
					that.tempComp.title = detail.symptoms.technical_name;
					that.journalEntry.components.push(that.tempComp);
				}));

				that.componentsList.push(componentsData[j].journal_entry_components);
			}
		}));
	}

	function careTeamInit(){
		returnPromise = $q.defer();
		queryPromise = $q.defer();
		careTeamRequest = query(queryPromise,'care_teams/care_team_members/users',{});
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

		// LOAD FOR 'date' OR FIRST RECORD OLDER THEN 'date'
		// OR
		// if blank, check if there is anything for today, and if there isn't, return the most recent date (this function would need to be called again)
		var that = this;

		if(date == null || date == ''){
			var getDate = query($q.defer(),'journal_entries',{
				orderBy: 'journal_entries.created|desc',
				limit: 1
			});
			getDate.then(
				function(data){
					var d = _fixTimestamp(data[0].journal_entries.created);
					that.date = _getStringDate(d);
					var today = _getStringDate(new Date);
					if(that.date != today){
						that.today = false;
					}else{
						that.today = true;
					}
				},
				function(error){
					console.log(error);
				}
			);
		}else{
			// Check whether there are entries for 'date', otherwise bring back the earliest day before 'date'
			var getDate = query($q.defer,'journal_entries',{
				field: 'journal_entries.created|has|' + date
			});
			getDate.then(
				function(data){
					if(data == null){
						that.today = false;
						query($q.defer,'journal_entries',{
							orderBy: 'journal_entries.created|desc',
							limit: 1
						}).then(
							function(data){console.log('line 392');
								that.date = _getStringDate(_fixTimestamp(data[0].journal_entries.created));
							},
							function(error){
								console.log('error in api (service) line 396', error);
							}
						);
					}else{
			// TODO check whether the date format coming through parameters can be '2015-02-14', and whether scope has 'date'
						that.date = date;
						that.today = true;
					}
				},
				function(error){
					console.log('error in api (service) line 402', error);
				}
			);
		}	

		// GET THE ENTRIES FOR A DAY
		// in this step we set up the journal_entry object that gets passed back
		$q.all([
			getDate
		]).then(function(){
			var dateString = that.date;
			user.getUser();

			if(dateString != ''){
				var journalEntries = query($q.defer(),'journal_entries',{
					field: 'journal_entries.created|has|'+dateString,
					orderBy: 'journal_entries.created|asc'
				});
			}else{
				console.log('error with dateString: ',dateString);
				return false;
			}
			journalEntries
			.then(function(data){
				that.tempData = data;

		// CREATE THE MASTER JOURNAL ENTRY OBJECT
				that.journalEntry = {
					date: _fixTimestamp(data[0].journal_entries.created).toDateString(),
		// MARK WHETHER ENTRY IS FOR TODAY OR NOT
					today: that.today
				};
			}).
			catch(function(error){
				console.log(error);
			});

		// GO THROUGH ALL JOURNAL ENTRIES, CREATE RAW COMPONENTS LIST
			$q.all([
				journalEntries
			]).then(function(){
				// set up the master components list
				that.componentsList = [];

				// go through all the entries
				var data = that.tempData;
				var components = [];
				for(i in data){
					promise = $q.defer();
					components.push(query(promise,'journal_entry_components/journal_entries',{
						field: 'journal_entry_components.journal_entry_id|eq|' + data[i].journal_entries.id
					}).then(function(componentsData){
// WHAT DO YOU DO IF THERE ARE NO ENTRIES FOR TODAY?
						for(j in componentsData){
							that.componentsList.push(componentsData[j].journal_entry_components);
						}
					}));
				}

		// GO THROUGH COMPONENTS RAW LIST, MAKE OBJECTS
				$q.all(
					components
				).then(function(){
					that.journalEntry.components = [];
					var data = that.componentsList;
					var details = [];

					for(i in data){
						// initialize the components section of the master journal entry object
						// structure of a component is:
						// { id: 1, type: 'image-card', title: 'My vacation', details: {} }

						// retrieve details for the different component types
						var promise = $q.defer();

						// check for note type
						if(data[i].note_id != null){
							details.push(getOne(promise,'notes',data[i].note_id)
							.then(function(detail){
								// add detail to the component
								that.tempComp = {
									id: '',
									type: '',
									title: '',
									details: {}
								};
								that.tempComp.title = 'Note';
								that.tempComp.type = 'text-card';
								that.tempComp.details = detail.notes;
								that.journalEntry.components.push(that.tempComp);
							}));
						}

						// check for symptom type
						if(data[i].symptom_id != null){
							// severity, symptom_id
							details.push(query(promise,'journal_entries/journal_entry_components/symptoms',{
								field: 'journal_entry_components.id|eq|' + data[i].id
							})
							//details.push(getOne(promise,'symptoms',data[i].symptom_id)
							.then(function(detail){
								// if there is a problem with the db record, there will be an empty array here
								if(detail.length > 0){
									// add detail to the component
									that.tempComp = {
										id: '',
										type: '',
										title: '',
										date: '',
										journal_entry_id: '',
										details: {}
									};
									that.tempComp.type = 'symptom-card';
									that.tempComp.id = detail[0].journal_entry_components.id;
									that.tempComp.details = detail[0].symptoms;
									that.tempComp.details.severity = detail[0].journal_entry_components.severity;
									that.tempComp.severity = detail[0].journal_entry_components.severity;
									that.tempComp.date = detail[0].journal_entry_components.created;
									that.tempComp.title = detail[0].symptoms.technical_name;
									that.tempComp.journal_entry_id = detail[0].journal_entry_components.journal_entry_id;
									that.journalEntry.components.push(that.tempComp);
								}
							}));
						}

						// check for image type
						// COMING...

					}// end for(i in data)

					$q.all(
						details
					).then(function(){
						var list = [];
						list.push(that.journalEntry);
						returnPromise.resolve(list);
					});

				}); // end $q.all(componentPromises)
			}); // end $q.all([journalEntries])
		});

		return returnPromise.promise;
	}

	function goalsInit(){
		returnGoalsPromise = $q.defer();
		getList($q.defer(),'goals',{})
		.then(function(data){
			goalList = [];
			for(i in data){
				var temp = {};
				temp.created = _fixTimestamp(data[i].created);
				temp.name = data[i].name;
				goalList.push(temp);
			} 
			returnGoalsPromise.resolve(goalList);
		})
		.catch(function(error){
			console.log('error in mainController',error);
		});

		return returnGoalsPromise.promise;
	}

	function liveChartList(){
		returnLiveChartDataPromise = $q.defer();
		
		var that = this;
		that.chartFileList = [];

		var fileUrls = [
			'/healthData.json',
			'/healthDataWesMom.json'
		];
		
		var promises = [];

		for(l in fileUrls){
			promises.push(
				$http.get(fileUrls[l])
				.success(function(lcData){
					var list = [];
					var today = new Date();
					for(i in lcData){
						if(i != 'patientInfo' && i != 'social'){
							var obj = lcData[i];
							var date = '';
							for(j in obj){
								//var details = JSON.stringify(obj[j]);
								var details = obj[j];
								var title = i.toUpperCase();

								if(i == 'aaa'){
									date = obj[j].startDate;
								}
								if(i == 'immunizations'){
									date = obj[j].administrationDate;
								}
								if(i == 'labs'){
									date = obj[j].items[0].date;
								}
								if(i == 'notifications'){
									date = obj[j].date;
								}
								if(i == 'meds'){
									date = obj[j].startDate;
								}
								if(i == 'planOfCare'){
									date = obj[j].date;
								}
								if(i == 'conditions'){
									date = obj[j].entryDate;
									title = obj[j].name;
								}
								if(i == 'procedures'){
									date = obj[j].date;
								}
								if(i == 'vitalSigns'){
									date = obj[j].date;
								}
								
								date = _fixChartDate(date);

								list.push({
									title: title,
									date: date,
									created: today.toDateString(),
									type: i + '-card',
									details: details
								});
							} // end for(j in obj)
						} // end if(i)
					} // end for(i in data)
					that.chartFileList.push(list);
				})
				.catch(function(error){
					console.log(error);
				})
			); // end promises.push()
		} // end for(l in fileUrls)

		$q.all(promises).then(function(){
			returnLiveChartDataPromise.resolve(that.chartFileList);
		});

		return returnLiveChartDataPromise.promise;
	}

	function addSymptom(returnPromise,symptomDataObj){
		// SET VARIABLES

		var today = _getStringDate(new Date);
		var that = this;
		that.currJournalEntryId = '';

		// CHECKING FOR EXISTENCE OF A JOURNAL ENTRY FOR TODAY

		var checkEntry = $q.defer();
		query($q.defer(),'journal_entries',{
			field: 'journal_entries.created|eq|' + today
		})
		.then(function(data){
			if(data.length == 0){
				var dataObj = {
					'wellness_score': 0
				};
				addRecord($q.defer(),'journal_entries',dataObj)
				.then(
					function(data) {
						that.currJournalEntryId = data.insertId;
						checkEntry.resolve();
					},
					function(error){
						console.log(error);
					}
				);
			}else{
				that.currJournalEntryId = data.id;
				checkEntry.resolve();
			}
		});

		// WHEN DONE ABOVE...

		$q.all([
			checkEntry.promise
		]).then(
			function(){
		
		// ADD A SYMPTOM RECORD IN TABLE "JOURNAL_ENTRY_COMPONENTS"

			var dataObj = {
				'severity': symptomDataObj.severity,
				'symptom_id': symptomDataObj.symptom_id,
				'journal_entry_id': that.currJournalEntryId
			};
			addRecord($q.defer(),'journal_entry_components',dataObj)
			.then(
				function(data) {
					query($q.defer(),'journal_entry_components/symptoms',{
						field: 'symptoms.id|eq|' + data.insertId
					})
					.then(function(data){
						returnPromise.resolve(data);
					});
				},
				function(error){
					returnPromise.reject(error);
				}
			);
		});

		return returnPromise.promise;
	}

	function getSymptomList(){
		var returnPromise = $q.defer();
		
		query($q.defer(),'symptom_categories/symptoms',{})
		.then(function(data){
			var returnObj = {};
			for(var i in data){
				if(data[i].symptom_categories.category in returnObj){
					
				}else{
					returnObj[data[i].symptom_categories.category] = {};
				}
				returnObj[data[i].symptom_categories.category][data[i].symptoms.technical_name] = data[i].symptoms.id;
			}
			returnPromise.resolve(returnObj);
		});

		return returnPromise.promise;
	}

}]);