kurbiApp.controller('CardControllerInit', ['api','$scope',
	'$timeout','$q','$element','$uibModal','$state','cloudinary',
function(api,$scope,$timeout,$q,$element,$uibModal,$state,cloudinary) {
	/*$scope.symptoms = {
		'Head': {'Eyes': {'Blurry Vision':1, 'Double Vision':2, 'Uncontrolled Watering':3, 'Dry Eyes':4, 'Itchy Eyes':5},
				'Ears': {'Ear Ache':6},
				'Nose': {'Runny Nose':7},
				'Jaw': {'Clicking':8},
				'Face': {'Sunburn':9},
				'Scalp': {'Itchy':10},
				'Brain': {'Migraine':11}},
		'Neck': {'Throat': {'Sore Throat':12}},
		'Torso': {'Stomach': {'Gas':13}},
		'Arms': {'Elbow': {'Burning':14}},
		'Back': {'Spine': {'Inflamation':15}},
		'Hips': {'Joint': {'Pain':16}},
		'Knees': {'Cap': {'Swelling':17}},
		'Feet': {'Heel': {'Stinging':18}}
	};*/
	//$scope.cards = cardDataService.cardData;
	//$scope.idCount = 1;

	$scope.initCardService = function () {
		for (var day in $scope.journalEntries) {
			var obj = $scope.journalEntries[day];
			//console.log("obj: ", obj);
			for (var index in obj.components) {
				var card = obj.components[index];
				//$scope.idCount = card.id;
//console.log("card: ", card);
				//for (var card in obj.components[index]) {
					//console.log("id: ", card.id);
					//console.log("type: ", card.type);
					//console.log("title: ", card.title);
					//console.log("sev: ", card.severity);
				//cardDataService.addCard(card);
				//}
			}
		}		
	};

	$scope.checkIfEmpty = function(v){

		if(typeof v == 'undefined'){
			return true;
		}
		if(typeof v == 'object'){
			if(v.length == 0){
				return true;
			}else{
				return false;
			}
		}
	};

	$scope.$on('allRendered', function(){
		// the "allRendered" event is supposed to broadcast when the 
		// cards are done being rendered, but there still is a brief
		// time between when the directive is done rendering and when
		// the Masonry will work, hence the $timeout
		/*$timeout(function(){
//console.log('allRendered detected');
			$('.journal-day').masonry({
				itemSelector: '.block',
				columnWidth: .33
			});
		},500);
*/
		$scope.initCardService(); // what does this do?? -Matt, Grabs the next card Id - Andrew
		//getSymptomsCount();
	});

	$scope.addCard = function(type,date){
		var newTitle = "";

		switch (type) {
			case 'text-card':
				newTitle = "New Journal Entry";
				newNote = "What's on your mind?";
				//++$scope.idCount;
				var cardObj = {id: -1, 'type': type, title: newTitle, details: {id: -1, title: newTitle, text: newNote}};
				//api.addTextCard($q.defer(),cardObj);
				$scope.updateCardUI(cardObj);
				break;
			case 'symptom-card':
				//var tableName = 'journal_entry_components';
				//console.log("Add Symptoms count: ", getSymptomsCount());
				//getSymptomsCount();
				/*var topSymptomsArray = [];
				$scope.topSymptomsArray = {};
				$scope.symptomCountArray.length > 4 ? topSymptomsArray = $scope.symptomCountArray.slice(0,5) : topSymptomsArray = $scope.symptomCountArray.slice(0,$scope.symptomCountArray.length);
				for (var symp in topSymptomsArray) {
					//console.log("Loop: ", topSymptomsArray[symp]);
					$scope.topSymptomsArray[topSymptomsArray[symp][0][0]] = topSymptomsArray[symp][0][1];
				}*/
				//var topSymsLimit = 5;

				// save a new entry to db
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'myModalContent.html',
					controller: 'ModalInstanceCtrl',
					//size: size,
					resolve: {
						symptoms: function () {
							return $scope.symptoms;
						},
						topSymptoms: function () {
							return api.symptomsObject.topSymptomsCountObj;
						},
						topSymptomsData: function(){
							return api.symptomsObject.topSymptomsData;
						}
					}
				});

			    modalInstance.result.then(
			    	function (dataObjList) {
						var d = new Date();
						var todaysMonth = d.getMonth() + 1;
						var todaysDay = d.getDate();
						if(todaysDay < 10)
							var todaysDay = '0' + todaysDay;
						if(todaysMonth < 10)
							var todaysMonth = '0' + todaysMonth;
						todaysDay = todaysDay.toString();
						todaysMonth = todaysMonth.toString();
						var todaysYear = d.getFullYear().toString();
						var todaysDate = (todaysMonth + '/' + todaysDay + '/' + todaysYear).toString();
						var cardObj = undefined;

			    		for (var index in dataObjList){
					    	// save a new entry-type to db
							api.addSymptom(dataObjList[index]).then(
								function(data){
									//console.log("insertId: ", data);
									cardObj = {id: data.insertId, 'type': type, title: data.symptomName, 
												severity: data.severity, details: {id: data.symptomId},
												created: todaysDate, date: todaysDate};
									$scope.updateCardUI(cardObj);
//console.log("Modal Result: ", cardObj);
								},
								function(error){
									console.log("Error: ", error)
								}
							);
			    		}
			    		//api.symptomsObject.update();
						//$scope.selected = selectedItem;
			    	}, 
			    	function () {
			      		console.log('Modal dismissed at: ' + new Date());
			      	}
			    );
				break;
			case 'image-card':
				// save a new entry to db
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'modules/file-upload/templates/upload-image.html',
					controller: 'UploadController'
					//size: size,
					/*resolve: {
						symptoms: function () {
							return $scope.symptoms;
						}
					}*/
				});
				modalInstance.result.then(
			    	function (img) {
			    		newTitle = "New Image";
						var cardObj = {id: 0, 'type': type, title: newTitle, 
							details: {
								cloudinaryPublicId: img.public_id
							}
						};
						$scope.updateCardUI(cardObj);				
			    	}, 
			    	function () {
			      		console.log('Modal dismissed at: ' + new Date());
			      	}
			    );
				break;
			default:
				break;
		}
		//$scope.showModal = true;
		//$scope.addSymptomCard();
	};

	/* INFINITE SCROLL (GET A NEW DAY EVERY TIME USER SCROLLS DOWN)
	http://desandro.github.io/masonry/demos/infinite-scroll.html
	$(function(){
	    
	    var $container = $('#container');
	    
	    $container.imagesLoaded(function(){
	      $container.masonry({
	        itemSelector: '.box',
	        columnWidth: 100
	      });
	    });
	    
	    $container.infinitescroll({
	      navSelector  : '#page-nav',    // selector for the paged navigation 
	      nextSelector : '#page-nav a',  // selector for the NEXT link (to page 2)
	      itemSelector : '.box',     // selector for all items you'll retrieve
	      loading: {
	          finishedMsg: 'No more pages to load.',
	          img: 'http://i.imgur.com/6RMhx.gif'
	        }
	      },
	      // trigger Masonry as a callback
	      function( newElements ) {
	        // hide new items while they are loading
	        var $newElems = $( newElements ).css({ opacity: 0 });
	        // ensure that images load before adding to masonry layout
	        $newElems.imagesLoaded(function(){
	          // show elems now they're ready
	          $newElems.animate({ opacity: 1 });
	          $container.masonry( 'appended', $newElems, true ); 
	        });
	      }
	    );
	    
	}); */

	/*function getSymptomsCount() {
		$scope.symptomCountArray = [];
		/*api.query($q.defer(),'journal_entries/journal_entry_components/symptoms',{
				count: 'journal_entry_components.symptom_id'}).then(
					function(detail){
						console.log("Symptoms count: ", detail);
					});
		api.query($q.defer(),'journal_entries/journal_entry_components/symptoms',{})
			.then(
					function(journalArray){
						//console.log("Symptoms count: ", journalArray);
						var temp = {};
						var idHolder = {};
						for (var obj in journalArray){
							//symptomCountDict[journalArray[obj].symptoms.id] === undefined ? symptomCountDict.push([journalArray[obj].symptoms.id, 1]) : symptomCountDict[journalArray[obj].symptoms.id]+=1;
							temp[journalArray[obj].symptoms.technical_name] === undefined ? temp[journalArray[obj].symptoms.technical_name] = 1 : temp[journalArray[obj].symptoms.technical_name]+=1;
							idHolder[journalArray[obj].symptoms.technical_name] = journalArray[obj].symptoms.id;
							//console.log("Symptoms count: ", journalArray[obj].symptoms.id + " " + symptomCountDict[journalArray[obj].symptoms.id]);
						}
						for (var t in temp) {
							$scope.symptomCountArray.push([[t, idHolder[t]], temp[t]]);
						}
						//console.log("Symptoms count: ", symptomCountDict);
						$scope.symptomCountArray.sort(function(a, b){
							if (a[1] > b[1]) //sort string descending
								return -1;
							if (a[1] < b[1])
								return 1;
							return 0; //default return value (no sorting)
						});
						//console.log("Symptoms count: ", symptomCountDict);
					}
				);

		//return symptomCountDict;
	};*/

	$scope.updateCardUI = function (cardObj) {
		// add new card to UI
		//console.log("cardObj: ", cardObj);
		//console.log("journal entries: ", $scope.journalEntries[0].components);
		if ($scope.journalEntries[0].components === undefined) {
			$scope.journalEntries[0]['components'] = [];
		}

		//This unshift causes problems if reload is called since Main Controller is reloaded again
			//and it wipes out anything here with another store of the cards
		/*$scope.$apply(function(cardObj){
			$scope.journalEntries[0].components.unshift(cardObj);
		});*/
		$scope.journalEntries[0].components.unshift(cardObj);
		//$state.reload();
		//$scope.journalEntries[0].components.unshift(
			//{id: newId, 'type': type, title: newTitle}
		//);

		// update the masonry grid layout
		/*$timeout(function(){
			$('.journal-day').masonry('reloadItems');
			$('.journal-day').masonry('layout');
		},650);*/
	};

	/*$scope.open = function (size) {

	  var modalInstance = $modal.open({
	    animation: true,
	    templateUrl: 'myModalContent.html',
	    controller: 'ModalInstanceCtrl',
	    size: size,
	    resolve: {
	      //items: function () {
	        //return $scope.items;
	      //}
	    }
	  });

	  /*modalInstance.result.then(function (selectedItem) {
	    $scope.selected = selectedItem;
	  }, function () {
	    $log.info('Modal dismissed at: ' + new Date());
	  });

	};*/ // end $scope.open()

	/*$scope.toggleAnimation = function () {
	  $scope.animationsEnabled = !$scope.animationsEnabled;
	};*/

}]);


kurbiApp.controller('CardController', ['$scope', '$locale', 'api',
function($scope, $locale, api){

	$scope.checkIfEmpty = function(v){

		if(typeof v == 'undefined'){
			return true;
		}
		if(typeof v == 'object'){
			if(v.length == 0){
				return true;
			}else{
				return false;
			}
		}
	};

}]);

kurbiApp.controller('TextCardController', ['$scope', '$locale','api', '$q',
	function($scope, $locale, api, $q){
		//$scope.noteText = 
	    $scope.onNoteEditClick = function(){
	    	//console.log("Symptom Controller: ", $scope.cards);
	    	$scope.saved = false;
	    	$scope.reversed = !$scope.reversed;
	    };

	    $scope.saveNote = function(cardToSave){
	    	$scope.onNoteEditClick();
	    	$scope.saved = true;	    	
			//$scope.timeSaved = Date.now();
console.log("Save Note: ", cardToSave);
			if(cardToSave.id === -1){
				var cardObj = {'type': cardToSave.type, title: cardToSave.details.title, text: cardToSave.details.text};
				api.addTextCard($q.defer(),cardObj).then(
					function(data){
						//console.log("card in promise: ", cardToSave);
						cardToSave.id = data;
						cardToSave.details.id = data;
					});
			}
			else{
				console.log("Controller Update Note: ", cardToSave);
				var cardObj = {id: cardToSave.details.id, 'type': cardToSave.type, title: cardToSave.details.title, text: cardToSave.details.text};
				api.updateTextCard(cardObj);
			}
	    };

	    $scope.deleteNote = function(cardToDelete){
	    	var indexToDelete = -1;
	    	var entryToDelete = undefined;

	    	for(var entry in $scope.journalEntries){
	    		for(var component in $scope.journalEntries[entry].components){
	    			//console.log($scope.journalEntries[entry].components[component]);

	    			if($scope.journalEntries[entry].components[component].details.id === cardToDelete.details.id){
	    				//console.log("FOUND IT!");
	    				entryToDelete = entry;
	    				indexToDelete = component;
	    			}
	    		}
	    	}

	    	api.deleteTextCard(cardToDelete.details.id);
	    	//Delete throws an error
	    	//console.log("entryToDelete: ", entryToDelete);
	    	//console.log("components: ", $scope.journalEntries[entryToDelete].components);
	    	$scope.journalEntries[entryToDelete].components.splice(indexToDelete, 1);
	    };
	}
]);

kurbiApp.controller('SymptomCardController', ['$scope', '$locale','api',
function($scope, $locale, api){
	//console.log("Symptom Controller");
	$scope.reversed = true;
	$scope.saved = false;
	$scope.severity = 0;
	$scope.timeSaved = new Date();
	$scope.defaultSlider = "default";
	$scope.grabSlider = "grab";
	//$scope.cards = cardDataService.cardData;

	//$scope.severityToAdd = {value: -1};
	//$scope.directiveDelegate = {};

	$scope.isEditable = function(cardCreated, cardDate){
		if(cardCreated !== undefined){
			var date = cardCreated;
		}
		else{
			var date = cardDate;
		}

		var d = new Date();
		var todaysMonth = d.getMonth() + 1;
		var todaysDay = d.getDate();
		if(todaysDay < 10)
			var todaysDay = '0' + todaysDay;
		if(todaysMonth < 10)
			var todaysMonth = '0' + todaysMonth;
		todaysDay = todaysDay.toString();
		todaysMonth = todaysMonth.toString();
		var todaysYear = d.getFullYear().toString();
		var todaysDate = (todaysMonth + '/' + todaysDay + '/' + todaysYear).toString();

		//var sympDate = cardDate.toString().substring(4,15);
		//console.log("IsEditable: ", date);
		var sympDate = new Date(date);
		var month = sympDate.getMonth() + 1;
		var day = sympDate.getDate();
		if(day < 10)
			day = '0' + day;
		if(month < 10)
			month = '0' + month;
		month = month.toString();
		day = day.toString();
		var year = sympDate.getFullYear().toString();
		var journalDate = (month + '/' + day + '/' + year).toString();

		//console.log("IsEditable: ", todaysDate + " " + journalDate);
		//var year = sympDate.substring(0,4);
		//var month = sympDate.substring(5,7);
		//var day = sympDate.substring(8,10);
		//var journalDate = (month + "/" + day + "/" + year).toString();

		if (todaysDate === journalDate || (todaysYear === year && todaysMonth === month && todaysDay === day)){
			return true;
		}
		return false;
	}

	$scope.updateSeverity = function (severity) {
		//
	}

    $scope.onEditClick = function(sliderStyle)
    {
    	//console.log("Symptom Controller: ", $scope.cards);
    	$scope.saved = false;
    	$scope.reversed = !$scope.reversed;
    	$scope.setSliderStyle(sliderStyle);
    	$scope.resetSeverity();
    };

    $scope.saveSeverity = function(cardToSave) 
    {
    	//$scope.card.severity = 7;
    	var sev = $scope.getSeverity();
    	$scope.saveSliderPosition(); // ???

				/*
		api.updateOne($q.defer(),tableName,dataObj,tableId)
			.then(
					function(data){
									
					},
					function(error){
						console.log(error);
					}
				);
				*/

    	$scope.onEditClick("default");
    	$scope.saved = true;    	
    	//console.log("Directive sev: ", sev);
		//console.log('saving severity: ', $scope.card.severity);
		$scope.card.severity = sev;
		$scope.timeSaved = Date.now();

		api.updateSymptomCard(cardToSave, cardToSave.id);
		//$scope.directiveDelegate.invoke();
    };

    $scope.saveNote = function(cardToSave){
		//$scope.timeSaved = Date.now();
		api.updateTextCard(cardToSave);
    };

    $scope.deleteSymptom = function(cardToDelete){
    	var indexToDelete = -1;
    	var entryToDelete = undefined;

    	for(var entry in $scope.journalEntries){
    		for(var component in $scope.journalEntries[entry].components){
    			//console.log($scope.journalEntries[entry].components[component]);

    			if($scope.journalEntries[entry].components[component].journal_entry_id === cardToDelete.journal_entry_id){
    				//console.log("FOUND IT!");
    				entryToDelete = entry;
    				indexToDelete = component;
    			}
    		}
    	}

    	api.deleteCard(cardToDelete.id);
    	//Delete throws an error
    	//console.log("entryToDelete: ", entryToDelete);
    	//console.log("components: ", $scope.journalEntries[entryToDelete].components);
    	$scope.journalEntries[entryToDelete].components.splice(indexToDelete, 1);
    	//$scope.$apply(function(){
	    	//$scope.journalEntries[entry].components[indexToDelete] = {};
	    	//delete $scope.journalEntries[entry].components[indexToDelete];    		
    	//});
    };

    $scope.deleteNote = function(cardIdToDelete){
    	//api.deleteTextCard(cardIdToDelete);
    }

	/*$scope.ok = function() {
	  $scope.showModal = false;
	};

	$scope.cancel = function() {
	  $scope.showModal = false;
	};*/

}]);

kurbiApp.controller('ModalInstanceCtrl', ['$scope', '$locale', 'symptoms', '$uibModalInstance', 'topSymptoms', 'topSymptomsData',
function($scope, $locale, symptoms, $uibModalInstance, topSymptoms, topSymptomsData){
	//console.log("ModalInstanceCtrl: ", topSymptomsData);
	$scope.symptoms = symptoms;
	$scope.firstClicked = false;
	$scope.closeOthers = true;
	$scope.showPlus = {};
	$scope.clickedList = {};
	$scope.selectedCategory = {value: ""};
	$scope.symptomsView = {};
	$scope.categoryView = {};
	$scope.topSymps = {};
	$scope.catArray = []; //Should get rid of this and return/use local variable
	$scope.symList = [];
	$scope.historyStack = [];
	$scope.lastClick = ""; //Should get rid of this and use clickStack
	$scope.currentClick = "Search by Category";
	$scope.showSearchView = false;
	$scope.showCategories = true;
	$scope.showTopSymptoms = true;
	$scope.clickStack = [];
	$scope.symsToAddList = {};
	$scope.modalSeverities = {};
	$scope.addedSymptoms = 0;
	$scope.addedSymps = {};
	$scope.searchList = [];
	$scope.symptomIds = [];
	$scope.modCatSymObj = {};
	
	$scope.hideSearch = "hide-search";
	
	$scope.mobileBrowse = function() {
		$scope.hideSearch = "hide-search";
		$scope.hideBrowse = "";
		$scope.symptomSearch = "";
	};
	
	$scope.mobileSearch = function() {
		$scope.hideSearch = "";
		$scope.hideBrowse = "hide-browse";
	};


	$scope.addSymptom = function (symptom){
		var severityToAdd = 0;

		if(topSymptomsData[symptom] === undefined || topSymptomsData[symptom].date !== "Today"){
			for (var key in $scope.modalSeverities){
				if (key === symptom){
					severityToAdd = $scope.modalSeverities[key];
				}
			}

			if (severityToAdd > 0){
				if ($scope.addedSymps[symptom] === ""){
					$scope.symsToAddList[symptom] = severityToAdd;
					$scope.addedSymps[symptom] = "addedSymptom";
					++$scope.addedSymptoms;

					for(var symKey in $scope.searchList){
						$scope.searchList[symKey].open = false;
					}
					for(var symKey in $scope.topSymps){
						$scope.topSymps[symKey].open = false;
					}
					for(var symKey in $scope.symptomsView){
						$scope.symptomsView[symKey].open = false;
					}					
					for (var key in $scope.clickedList) {
						$scope.clickedList[key] = false;
					}
				}
				else{
					alert("Symptom already added. To update severity move slider");
				}
			}
			else{
				alert("Slider can't be at default position when adding");
			}
		}
		else{
			alert("Sorry, you've already added this symptom today. If you would like to update it, go back to your journal and edit it on the card.");
		}
	};

	$scope.removeSymptom = function(symptom){
		delete $scope.symsToAddList[symptom];
		$scope.addedSymps[symptom] = "";
		--$scope.addedSymptoms;

		for (var key in $scope.clickedList) {
			$scope.clickedList[key] = false;
		}
	};

	$scope.updateSeverity = function (severity) {
		var focusSymptom = undefined;
		for (var key in $scope.clickedList) {
			if ($scope.clickedList[key] === true) {
				focusSymptom = key;
				break;
			}			
		}

		if (focusSymptom !== undefined) {
			$scope.modalSeverities[focusSymptom] = severity;
		}
	};

	$scope.filterAddedSymptoms = function(symptom){
		switch ($scope.filterType){
			case 'added':
				return ($scope.symsToAddList !== undefined && $scope.symsToAddList[symptom.name] !== undefined);
				break;
			case 'search':
				return ($scope.symptomSearch === "" || symptom.name.toLowerCase().slice(0,$scope.symptomSearch.length) === $scope.symptomSearch.toLowerCase());
				break;
			default:
				return false;
				break;
		};
	};

	$scope.clickCategoryView = function(index, category) {
		$scope.showSearchView = false;
		$scope.showCategories = true;
		$scope.showTopSymptoms = false;
		var tempNext = {};
		var tempKeys = undefined;
		var historyCopy = [];
		var lastView = {};
		var clickCopy = [];
		var clickArray = [];
		var click = "";
		//var lastView = [];
		//var lastLeft = {};
		//var lastRight = {};	
//console.log("Click Category: ", $scope.historyStack);		
		$scope.selectedCategory.value = category;

		for (var key in $scope.clickedList) {
			$scope.clickedList[key] = false;
		}		

		//if ($scope.lastClick !== category) {
			//$scope.lastClick = category;
			historyCopy = $scope.historyStack.slice();
			lastView = historyCopy.pop();
			//lastLeft = lastView[0];
			//lastRight = lastView[1];
			tempNext = lastView[category];
			tempKeys = Object.keys(tempNext);
			$scope.clickStack.push(category);

			clickCopy = $scope.clickStack.slice();
			click = clickCopy.pop();
			clickArray.push(click);
			
			while(clickCopy.length > 1){
				click = clickCopy.pop();
				clickArray.push(click);
				
			}
			click = clickArray.pop();
			$scope.currentClick = click;
			while(clickArray.length > 0){
				click = clickArray.pop();
				$scope.currentClick = $scope.currentClick + " > " + click;
			}
//console.log("Keys: ", tempKeys);
			if(tempKeys[0] !== undefined && tempNext[tempKeys[0]] !== undefined && tempNext[tempKeys[0]].id === undefined){
				$scope.categoryView = tempNext;

				//tempHistory.push($scope.categoryView);
				//tempHistory.push($scope.symptomView);
				//$scope.historyStack.push(tempHistory);
				$scope.historyStack.push(tempNext);
			}
			else{
				$scope.symptomsView = tempNext;
				$scope.showCategories = false;
			}
		//}
	};

	$scope.clickSymptomsView = function(index, symptom) {
		var currentView = $scope.symptomsView;
		var newView = $scope.symptomsView[symptom];
		//var tempHistory = [];
		//var historyCopy = [];
		//var lastView = [];
		//var lastLeft = {};
		//var lastRight = {};
		//$scope.lastClick = symptom;

		//if (typeof currentView !== undefined && typeof currentView !== 'number' && typeof currentView !== 'string'
			//&& typeof newView !== undefined && typeof newView !== 'number' && typeof newView !== 'string') {	
			//$scope.categoryView = currentView;
			$scope.selectedCategory.value = symptom;

				//$scope.symptomView = newView;

				//tempHistory.push($scope.categoryView);
				//tempHistory.push($scope.symptomView);
				//$scope.historyStack.push(tempHistory);
				//$scope.clickStack.push(symptom);
			for (var key in $scope.clickedList) {
				if (key !== symptom) {
					$scope.clickedList[key] = false;
				}
				
			}
			$scope.clickedList[symptom] = !$scope.clickedList[symptom];

			/*if ($scope.isThingInObj(newView, $scope.symList)) {
				//console.log("IF3");
				if ($scope.firstClicked) {
					//console.log("IF4");
					for (var key in $scope.clickedList) {
						if (key !== symptom) {
							$scope.clickedList[key] = false;
						}
						
					}
					$scope.clickedList[symptom] = !$scope.clickedList[symptom];
				}
				else {
					//console.log("ELSE3");
					$scope.firstClicked = true;
				}
			}
			else {
				//console.log("ELSE2");
			}
		}
		else {

		}*/
	};

	$scope.clickSearchView = function (index, symptom) {
		for (var key in $scope.clickedList) {
			if (key !== symptom) {
				$scope.clickedList[key] = false;
			}
		}

		$scope.clickedList[symptom] = !$scope.clickedList[symptom];
	};

	$scope.showSymptomsAdded = function () {
		var found = false;
		
		for (var added in $scope.addedSymps) {
			if ($scope.addedSymps[added] === "addedSymptom") {
				found = true;
			}
		}

		if (found) {
			$scope.symptomSearch = "";
			$scope.filterType = 'added';

			$scope.showSearchView = true;

			for (var key in $scope.clickedList) {
				$scope.clickedList[key] = false;
			}			
		}
	};

	$scope.saveSymptom = function () {
		if (Object.keys($scope.symsToAddList).length > 0) {
			var dataObjList = [];

			var timeSaved = Date.now();

			for (var key in $scope.symsToAddList) {
				if(key !== undefined && $scope.symsToAddList[key] !== undefined){
					var dataObj = {
						'symptomName': key,
						'severity': $scope.symsToAddList[key],
						'symptom_id': $scope.symptomIds[key],
						'journal_entry_id': 1,
						'date': timeSaved
					};

					dataObjList.push(dataObj);					
				}
				else{
					console.log("ERROR Save Symptom: Trying to add undefined symptom object!");
				}
			}

			if(dataObjList.length > 0){
				$uibModalInstance.close(dataObjList);
			}
			else{
				$uibModalInstance.dismiss('cancel');
			}
		}
		else {
			$uibModalInstance.dismiss('cancel');
		}
	};

	$scope.cancel = function () {
	  $uibModalInstance.dismiss('cancel');
	};

	$scope.clickBack = function () {
		var historyCopy = [];
		var lastView = {};
		var clickCopy = [];
		var currentView = {};
		var currentClick = "";	
		var click = "";	
		$scope.showSearchView = false;
		$scope.showCategories = true;
//console.log("Click back: ", $scope.clickStack);

		if($scope.historyStack.length > 1){
			historyCopy = $scope.historyStack.slice();
			currentView = historyCopy.pop();
			currentClick = $scope.clickStack.pop();

			var categories = Object.keys(currentView);
			if(categories.indexOf(currentClick) === -1){
				currentView = $scope.historyStack.pop();
				currentView = historyCopy.pop();
			}

			if($scope.clickStack.length !== 0){
				clickCopy = $scope.clickStack.slice();
				var lastClick = clickCopy.pop();				
			}

			for (var key in $scope.clickedList) {
				$scope.clickedList[key] = false;
			}

			//if (currentView[1] !== undefined) {
				//$scope.categoryView = currentView[0];
				//$scope.symptomsView = currentView[1];
				//$scope.selectedCategory.value = currentClick;
			//}
			$scope.categoryView = currentView;
			$scope.selectedCategory.value = currentClick;
			$scope.lastClick = lastClick;

			if(lastClick === "Search by Category"){
				$scope.showTopSymptoms = true;
			}
		}
		else if($scope.clickStack.length > 1){
			//historyCopy = $scope.historyStack.slice();
			//lastView = historyCopy.pop();	
			//$scope.categoryView = lastView;

			currentClick = $scope.clickStack.pop();
			$scope.selectedCategory.value = currentClick;
			clickCopy = $scope.clickStack.slice();
			$scope.lastClick = clickCopy.pop();
			$scope.showTopSymptoms = true;
		}
		else{
			//Do nothing, no where to go but a black hole
		}

		clickCopy = $scope.clickStack.slice();
		click = clickCopy.pop();
		$scope.currentClick = click;
		while(clickCopy.length > 1){
			click = clickCopy.pop();
			$scope.currentClick = $scope.currentClick + " > " + click;
		}		
//console.log("Click back: ", $scope.clickStack);		
//console.log("Last click: ", $scope.lastClick);
	};

	$scope.modalSearchChange = function (change) {
		if($scope.symptomSearch.length > 0 && change !== "blur"){
			$scope.showSearchView = true;
			$scope.filterType = 'search';

			for(var key in $scope.clickedList){
				$scope.clickedList[key] = false;
			}			
		}
		else if($scope.symptomSearch.length <= 0){
			$scope.showSearchView = false;
		}
	};

	convertObjToArray = function(objToIterate) {
		for (var key in objToIterate) {
			if (typeof key === undefined)
				return;
			else if (objToIterate.hasOwnProperty(key)) {
				$scope.clickedList[key] = false;
				$scope.showPlus[key] = false;
				$scope.addedSymps[key] = "";
				$scope.modalSeverities[key] = 0;
				$scope.catArray.push(key);
				convertObjToArray(objToIterate[key]);					

				if (typeof objToIterate[key] === 'number' || typeof objToIterate[key] === 'string') {
					$scope.symList.push(key);
					$scope.symptomIds[key] = objToIterate[key];
					$scope.searchList.push({name: key, open: false});
					$scope.showPlus[key] = true;
				}
			}
			else {
				$scope.catArray.push(key);
			}
		}
	};

	/*modifyCategorySymptomObj = function(symObj, lastKey){
		for (var key in symObj){
			if(lastKey === undefined || lastKey === ""){
				//first iteration
				$scope.modCatSymObj[key] = {};
			}
			var newObj = {};
			if (typeof key === undefined)
				return;
			else if (symObj.hasOwnProperty(key)) {
				$scope.modCatSymObj[key] = {};
				modifyCategorySymptomObj(symObj[key], key);

				if (typeof symObj[key] === 'number') {
					//
				}
			}
			else {
				//$scope.catArray.push(key);
			}
		}
	}*/

	modifyCategorySymptomObj = function(symObj){
		for (var key in symObj){
			if (typeof key === undefined){
				return;
			}
			else if (symObj.hasOwnProperty(key)) {
				if (typeof symObj[key] === 'number') {
					symObj[key] = {id: symObj[key], open: false};
				}
				else{
					modifyCategorySymptomObj(symObj[key]);
				}
			}
			else {
				console.log("Do we ever get here? ", key);
			}
		}
	}	

	initModal = function(symptomObj) {
		var tempHistory = [];
		var symptomObjCopy = {};
		symptomObjCopy = angular.copy(symptomObj);

		convertObjToArray(symptomObjCopy);
//console.log($scope.showPlus);
		var topLevel = getSymCategories(symptomObj);
		$scope.modCatSymObj = angular.copy(symptomObj);
//console.log("Mod CatSympObj: ", $scope.modCatSymObj);
		modifyCategorySymptomObj($scope.modCatSymObj);
//console.log("Mod CatSympObj: ", $scope.modCatSymObj);
		$scope.categoryView = angular.copy($scope.modCatSymObj);
		$scope.topSymps = getTopNSymptoms(5);
		$scope.selectedCategory.value = -1;

		deleteListFromList($scope.catArray, topLevel);

		//tempHistory.push($scope.categoryView);		
		//tempHistory.push($scope.symptomView);
		//$scope.historyStack.push(tempHistory);
		$scope.historyStack.push($scope.categoryView);
		
		$scope.clickStack.push($scope.currentClick);
	};

	getTopNSymptoms = function(n){
		var topNSymptoms = [];
		var topNObj = {};

		for(var top in topSymptomsData){
			if(topNSymptoms.length >= n){
				if(topSymptomsData[top].count > topNSymptoms[0].count){
					topNSymptoms.splice(0,1);
					var obj = {symptom: top, count: topSymptomsData[top].count}
					topNSymptoms.push(obj);

					topNSymptoms.sort(function(a, b){
					 var catA=a.count, catB=b.count;
					 if (catA < catB) //sort string ascending
					  return -1;
					 if (catA > catB)
					  return 1;
					 return 0; //default return value (no sorting)
					});					
				}
			}
			else{
				var obj = {symptom: top, count: topSymptomsData[top].count}
				topNSymptoms.push(obj);

				topNSymptoms.sort(function(a, b){
				 var catA=a.count, catB=b.count;
				 if (catA < catB) //sort string ascending
				  return -1;
				 if (catA > catB)
				  return 1;
				 return 0; //default return value (no sorting)
				});				
			}
		}

		for(var t in topNSymptoms){
			topNObj[topNSymptoms[t].symptom] = {id: topSymptoms[topNSymptoms[t].symptom], open: false};
		}
		return topNObj;
	}

	getSymCategories = function(symObj) {
		if (Object.keys(symObj).length > 0 || Array.isArray(symObj)) {
			var tempList = [];

			if (Array.isArray(symObj) && typeof symObj[0] !== undefined) {
				return undefined;
			}
			else {
				for (var key in symObj) {
					tempList.push(key);
				}

				tempList.sort(function(a, b){
				 var catA=a.toLowerCase(), catB=b.toLowerCase();
				 if (catA < catB) //sort string ascending
				  return -1;
				 if (catA > catB)
				  return 1;
				 return 0; //default return value (no sorting)
				});

			}
			return tempList;
		}
		else {
			return undefined;
		}
	};

	deleteListFromList = function(sourceList, deletionList) {
		for (var index in deletionList) {
			var idx = sourceList.indexOf(deletionList[index]);
			if (idx >= 0) {
				sourceList.splice(idx, 1);
			}
		}
	};

	isThingInObj = function (objToCheck, listOfThings) {
		for (var index in listOfThings) {
			if (typeof objToCheck !== undefined && typeof listOfThings[index] !== undefined && typeof index !== undefined &&
				objToCheck !== undefined && listOfThings[index] !== undefined && index !== undefined) {
				if (objToCheck.hasOwnProperty(listOfThings[index])) {
					return true;
				}
			}
		}
		return false;
	};

	getSymptomId = function (symptom) {
		return $scope.symptomIds[symptom];
	};

	initModal($scope.symptoms);

}]);