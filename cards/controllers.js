kurbiApp.controller('CardControllerInit', ['api','$scope',
	'$timeout','$q','$element','$modal','$state','cloudinary',
function(api,$scope,$timeout,$q,$element,$modal,$state,cloudinary) {
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
	$scope.idCount = 1;

	$scope.initCardService = function () {
		for (var day in $scope.journalEntries) {
			var obj = $scope.journalEntries[day];
			//console.log("obj: ", obj);
			for (var index in obj.components) {
				var card = obj.components[index];
				$scope.idCount = card.id;
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

	$scope.$on('allRendered', function(){
		// the "allRendered" event is supposed to broadcast when the 
		// cards are done being rendered, but there still is a brief
		// time between when the directive is done rendering and when
		// the Masonry will work, hence the $timeout
		$timeout(function(){
//console.log('allRendered detected');
			$('.journal-day').masonry({
				itemSelector: '.block',
				columnWidth: .33
			});
		},50);

		$scope.initCardService(); // what does this do?? -Matt, Grabs the next card Id - Andrew
		//getSymptomsCount();
	});

	$scope.addCard = function(type,date){
		var newTitle = "";

		switch (type) {
			case 'text-card':
				newTitle = "New Journal Entry";
				++$scope.idCount;
				var cardObj = {id: $scope.idCount, 'type': type, title: newTitle};
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
				var modalInstance = $modal.open({
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
			    		for (var index in dataObjList)  {
					    	// save a new entry-type to db
							api.addSymptom($q.defer(),dataObjList[index]);
							++$scope.idCount;
							var cardObj = {id: $scope.idCount, 'type': type, title: dataObjList[index].symptomName, 
											severity: dataObjList[index].severity, details: {id: dataObjList[index].symptom_id}};
							$scope.updateCardUI(cardObj);
			    			//$scope.updateCardUI(100+index, type, dataObjList[index].symptomName);
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
				newTitle = "New Image";
				++$scope.idCount;
				var cardObj = {id: $scope.idCount, 'type': type, title: newTitle};
				$scope.updateCardUI(cardObj);				
				//$scope.updateCardUI(100, type, newTitle);
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
		if ($scope.journalEntries[0].components === undefined) {
			$scope.journalEntries[0]['components'] = [];
		}

		$scope.journalEntries[0].components.unshift(cardObj);		
		//$scope.journalEntries[0].components.unshift(
			//{id: newId, 'type': type, title: newTitle}
		//);

		// update the masonry grid layout
		/*$timeout(function(){
			$('.journal-day').masonry('reloadItems');
			$('.journal-day').masonry('layout');
		},650);*/
		$state.reload();	
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
	/*$scope.addSymptomCard = function(api)
	{
		//$scope.showModal = true;
	};*/

	// this is called in the directives.js file

}]);


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

    $scope.saveSeverity = function() 
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
		//$scope.directiveDelegate.invoke();
    };

    $scope.deleteSymptom = function(cardIdToDelete){
    	var indexToDelete = -1;
    	for(var entry in $scope.journalEntries){
    		for(var component in $scope.journalEntries[entry].components){
    			//console.log($scope.journalEntries[entry].components[component]);

    			if($scope.journalEntries[entry].components[component].journal_entry_id === cardIdToDelete){
    				indexToDelete = component;
    			}
    		}
    	}
    	//Delete throws an error
    	$scope.journalEntries[entry].components[indexToDelete] = {};
    	//delete $scope.journalEntries[entry].components[indexToDelete];
    };

	/*$scope.ok = function() {
	  $scope.showModal = false;
	};

	$scope.cancel = function() {
	  $scope.showModal = false;
	};*/

}]);

kurbiApp.controller('ModalInstanceCtrl', ['$scope', '$locale', 'symptoms', '$modalInstance', 'topSymptoms', 'topSymptomsData',
function($scope, $locale, symptoms, $modalInstance, topSymptoms, topSymptomsData){
	//console.log("ModalInstanceCtrl: ", topSymptomsData);
	$scope.symptoms = symptoms;
	$scope.firstClicked = false;
	//$scope.backClicked = false;
	$scope.closeOthers = true;
	//$scope.disable = {value:true};
	//$scope.status = {open:false};
	$scope.showPlus = {};
	$scope.clickedList = {};
	//$scope.currentCat = "";
	//$scope.showCategory = false;
	$scope.selectedCategory = {value: ""};
	$scope.rightView = {};
	$scope.leftView = {};
	$scope.catArray = []; //Should get rid of this and return/use local variable
	$scope.symList = [];
	$scope.historyStack = [];
	$scope.lastClick = ""; //Should get rid of this and use clickStack
	$scope.showSearchView = false;
	$scope.clickStack = [];
	//$scope.severityToAdd = {value: -1};
	$scope.symsToAddList = {};
	$scope.modalSeverities = {};
	$scope.addedSymptoms = 0;
	$scope.addedSymps = {};
	$scope.searchList = [];
	$scope.symptomIds = [];
	//$scope.addSymptom = addSymptom;

	$scope.addSymptom = function (symptom) {
		var severityToAdd = 0;

		if(topSymptomsData[symptom].date !== "Today"){
			for (var key in $scope.modalSeverities) {
				if (key === symptom) {
					severityToAdd = $scope.modalSeverities[key];
				}
			}

			if (severityToAdd > 0) {
				$scope.symsToAddList[symptom] = severityToAdd;
				$scope.addedSymps[symptom] = "addedSymptom";
				++$scope.addedSymptoms;
			}
			else {
				alert("Slider can't be at default position when adding");
			}
		}
		else{
			alert("Sorry, you've already added this symptom today. If you would like to update it, go back to your journal and edit it on the card.");
		}
		//console.log("Add List: ", $scope.symsToAddList);
	};

	$scope.removeSymptom = function(symptom){
		delete $scope.symsToAddList[symptom];
		$scope.addedSymps[symptom] = "";
		--$scope.addedSymptoms;

		//var tempList = [];

		/*for(var s in $scope.searchList){
			if($scope.searchList[s] === symptom){
				delete $scope.searchList[s];
			}
		}*/
		/*for (var added in $scope.addedSymps) {
				if ($scope.addedSymps[added] === "addedSymptom") {
					tempList.push(added);
				
					if()
				}
			}
		}

		$scope.searchList = [];
		$scope.searchList = tempList.slice();*/

		for (var key in $scope.clickedList) {
			$scope.clickedList[key] = false;
		}		
		//console.log("Remove Symptom: ", $scope.symsToAddList);
	};

	$scope.updateSeverity = function (severity) {
		var focusSymptom = undefined;
		for (var key in $scope.clickedList) {
			//console.log("Save: ", $scope.clickedList[key]);
			if ($scope.clickedList[key] === true) {
				focusSymptom = key;
				break;
			}			
		}

		//console.log("Print symp: ", focusSymptom);
		//console.log("Print sev: ", severity);		
		//console.log("Before update: ", $scope.modalSeverities[focusSymptom]);

		if (focusSymptom !== undefined) {
			$scope.modalSeverities[focusSymptom] = severity;
		}
		//console.log("Focused: ", focusSymptom);
		//console.log("After Update: ", $scope.modalSeverities[focusSymptom]);
	};

	$scope.filterAddedSymptoms = function(symptom){
		switch ($scope.filterType){
			case 'added':
				return ($scope.symsToAddList !== undefined && $scope.symsToAddList[symptom.name] !== undefined);
				break;
			case 'search':
			//console.log("Filter Search: ", $scope.symptomSearch === "");
			//console.log("Filter Search: ", symptom.toLowerCase().slice(0,$scope.symptomSearch.length));
			//console.log("Filter Search: ", symptom.toLowerCase().slice(0,$scope.symptomSearch.length) === $scope.symptomSearch.toLowerCase());
			//console.log("Filter Search: ", symptom.toLowerCase() + " " + $scope.symptomSearch.toLowerCase());
			//console.log("Filter Search: ", $scope.searchList);
				return ($scope.symptomSearch === "" || symptom.name.toLowerCase().slice(0,$scope.symptomSearch.length) === $scope.symptomSearch.toLowerCase());
				break;
			default:
				return false;
				break;
		};
	};

	$scope.clickLeftView = function(index, category) {
		//$scope.backClicked = false;
		$scope.showSearchView = false;
		var tempHistory = [];
		var historyCopy = [];
		var lastView = [];
		var lastLeft = {};
		var lastRight = {};
		//console.log("rightView: ", $scope.currentRightView);
		//console.log("leftView: ", $scope.currentLeftView);	
		
		$scope.selectedCategory.value = category;
		//$scope.showCategory = true;
		//$scope.currentCat = category;

		for (var key in $scope.clickedList) {
			$scope.clickedList[key] = false;		
		}		
		//$scope.status = {open:false};
		//$scope.symptomClicked = "";
		//var newView = $scope.getSymCategories($scope.currentLeftView[category]);
		//$scope.rightView = $scope.currentLeftView[category];
		if ($scope.lastClick !== category) {
			$scope.lastClick = category;
			historyCopy = $scope.historyStack.slice();
			lastView = historyCopy.pop();
			lastLeft = lastView[0];
			lastRight = lastView[1];
			$scope.rightView = lastLeft[category];
			/*if ($scope.isThingInObj($scope.rightView, $scope.symList)) {
				//$scope.showPlus = true;
				$scope.disable.value = false;
			}
			else {
				//$scope.showPlus = false;
				$scope.disable.value = true;
			}*/
			//$scope.rightView = newView;
			//$scope.currentRightView = $scope.currentLeftView[category];

			tempHistory.push($scope.leftView);
			tempHistory.push($scope.rightView);
			$scope.historyStack.push(tempHistory);
			$scope.clickStack.push(category);
			//$scope.$apply();
			//$scope.nextleftView = $scope.currentLeftView[category];
			//console.log("Left History: ", $scope.historyStack);
			//console.log("Left: ", $scope.leftView);
			//console.log("Right: ", $scope.rightView);
			//console.log("Left Click: ", $scope.clickStack);			
			//console.log("rightView: ", $scope.currentRightView);
			//console.log("leftView: ", $scope.currentLeftView);
		}
	};

	$scope.clickRightView = function(index, symptom) {
		//console.log("rightView: ", $scope.currentRightView);
		//console.log("leftView: ", $scope.currentLeftView);		
		//var newView = $scope.getSymCategories($scope.currentRightView);
		//$scope.backClicked = false;
		var currentView = $scope.rightView;
		var newView = $scope.rightView[symptom];
		var tempHistory = [];
		var historyCopy = [];
		var lastView = [];
		var lastLeft = {};
		var lastRight = {};
		$scope.lastClick = symptom;

		/*if (typeof newView !== undefined && typeof newView !== 'number' && typeof newView !== 'string'
			&& typeof $scope.currentRightView[symptom] !== undefined 
			&& typeof $scope.currentRightView[symptom] !== 'number' && typeof $scope.currentRightView[symptom] !== 'string') {*/
		if (typeof currentView !== undefined && typeof currentView !== 'number' && typeof currentView !== 'string'
			&& typeof newView !== undefined && typeof newView !== 'number' && typeof newView !== 'string') {	
			$scope.leftView = currentView;
			$scope.selectedCategory.value = symptom;
			//$scope.currentCat = symptom;
			//$scope.currentLeftView = $scope.currentRightView;

			//newView = $scope.getSymCategories($scope.currentRightView[symptom]);
			//newView = $scope.currentRightView[symptom];
			//console.log("IF1");
			//if (newView !== undefined) {
				//console.log("IF2");
				$scope.rightView = newView;

				tempHistory.push($scope.leftView);
				tempHistory.push($scope.rightView);
				$scope.historyStack.push(tempHistory);
				$scope.clickStack.push(symptom);
				//console.log("Right History: ", $scope.historyStack);
				//console.log("Left: ", $scope.leftView);
				//console.log("Right: ", $scope.rightView);
				//console.log("Right Click: ", $scope.clickStack);
			/*}
			else if ($scope.currentRightView[symptom] !== undefined) {
				console.log("ELSEIF1");
				//console.log("current left: ", $scope.currentRightView[symptom]);
				$scope.rightView = $scope.currentRightView[symptom];
				$scope.currentRightView = $scope.currentLeftView[symptom];
			}*/

			if ($scope.isThingInObj($scope.rightView, $scope.symList)) {
				//console.log("IF3");
				//$scope.showPlus = true;
				//$scope.disable.value = false;
				if ($scope.firstClicked) {
					//console.log("IF4");
					for (var key in $scope.clickedList) {
						//console.log("key: ", key);
						//console.log("value: ", $scope.clickedList[key]);
						if (key !== symptom) {
							$scope.clickedList[key] = false;
						}
						
					}
					$scope.clickedList[symptom] = !$scope.clickedList[symptom];
					//$scope.symptomClicked = symptom;
					//$scope.open = !$scope.open;
				}
				else {
					//console.log("ELSE3");
					$scope.firstClicked = true;
				}
			}
			else {
				//console.log("ELSE2");
				//$scope.showPlus = false;
				//$scope.disable.value = true;
			}
		}
		else {
			/*for (var ky in clickList) {
				console.log("ngrepeat ky: ", ky);
				console.log("ngrepeat value: ", clickList[ky]);
				clickList[ky] = false;
			}*/
			//clickList[symptom] = !clickList[symptom];

			for (var key in $scope.clickedList) {
				//console.log("key: ", key);
				//console.log("value: ", $scope.clickedList[key]);
				if (key !== symptom) {
					$scope.clickedList[key] = false;
				}
				
			}
			$scope.clickedList[symptom] = !$scope.clickedList[symptom];
			//console.log("ELSE1: ", symptom);

			//closed.value = !closed.value;
			//console.log("ELSE1: ", closed.value);
			//$scope.showPlus = true;
			//$scope.disable.value = false;
			//$scope.symptomClicked = symptom;
			//$scope.open = !$scope.open;
		}

		//$scope.$apply();
		//console.log("open: ", $scope.status.open);
		//console.log("disable: ", $scope.disable.value);
		//$scope.rightSideObj = $scope.rightSideObj[symptom];
		//$scope.leftSide = [];
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
		//var tempList = [];
		var found = false;
		
		for (var added in $scope.addedSymps) {
			if ($scope.addedSymps[added] === "addedSymptom") {
				//tempList.push(added);
				found = true;
			}
		}

		if (found) {
			$scope.symptomSearch = "";
			$scope.filterType = 'added';
			//$scope.searchList = [];
			//$scope.searchList = tempList.slice();
			$scope.showSearchView = true;

			for (var key in $scope.clickedList) {
				$scope.clickedList[key] = false;
			}			
		}
	};

	$scope.ok = function () {
		/*var focusSymptom = undefined;
		for (var key in $scope.clickedList) {
			//console.log("Save: ", $scope.clickedList[key]);
			if ($scope.clickedList[key] === true) {
				focusSymptom = key;
				break;
			}			
		}*/

		//if (focusSymptom !== undefined) {
		//console.log("Add List: ", Object.keys($scope.symsToAddList).length);
		if (Object.keys($scope.symsToAddList).length > 0) {
			//console.log("Add List: ", $scope.symsToAddList);
			var dataObjList = [];
			//var symNameList = [];
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
					//symNameList.push(key);
					dataObjList.push(dataObj);					
				}
				else{
					console.log("ERROR Save Symptom: Trying to add undefined symptom object!");
				}
			}
			//console.log("symNameList: ", symNameList);
	    	//var sev = $scope.symsToAddList.pop();
	    	//var sev = $scope.pray;
	    	//console.log("Modal severity: ", sev);
	    	//$scope.saveSliderPosition(); // ???
	    	//$scope.onEditClick("default");
	    	//$scope.saved = true;    	
	    	//console.log("Directive sev: ", sev);
			//console.log('saving severity: ', $scope.card.severity);
			//$scope.card.severity = sev;
			//$scope.$apply();
			// get values from edit form
			//var symName = focusSymptom;
			//console.log("Saved symptom: ", symName);
			//$scope.addSymptom(tableName, dataObj, symName);
			if(dataObjList.length > 0){
				$modalInstance.close(dataObjList);
			}
			else{
				$modalInstance.dismiss('cancel');
			}
		}
		else {
			$modalInstance.dismiss('cancel');
		}
	};

	$scope.cancel = function () {
	  $modalInstance.dismiss('cancel');
	};

	$scope.clickBack = function () {
		var historyCopy = [];
		var clickCopy = [];
		$scope.showSearchView = false;

		if ($scope.historyStack.length > 1) {
			//if (!$scope.backClicked) {
				var lastView = $scope.historyStack.pop();
				var lastClick = $scope.clickStack.pop();
				//$scope.backClicked = true;
				historyCopy = $scope.historyStack.slice();
				clickCopy = $scope.clickStack.slice();
				var currentView = historyCopy.pop();
				var currentClick = clickCopy.pop();

				/*if ($scope.historyStack.length > 1) {
					lastView = $scope.historyStack.pop();
				}
				else {
					historyCopy = $scope.historyStack.slice();
					lastView = historyCopy.pop();
				}*/
			/*}
			else {

			}*/

			for (var key in $scope.clickedList) {
				$scope.clickedList[key] = false;
			}

			//console.log("Current Click: ", currentClick);
			//console.log("Last Left: ", currentView[0]);
			//console.log("Last Right: ", currentView[1]);

			if (currentView[1] !== undefined) {
				$scope.leftView = currentView[0];
				$scope.rightView = currentView[1];
				$scope.selectedCategory.value = currentClick;
			}			
		}
	};

	$scope.modalSearchChange = function (change) {
		if ($scope.symptomSearch.length > 0 && change !== "blur") {
			//$scope.searchList = [];
			//$scope.searchList = $scope.symList.slice();
			$scope.showSearchView = true;
			$scope.filterType = 'search';

			for (var key in $scope.clickedList) {
				$scope.clickedList[key] = false;
			}			
		}
		/*else {
			$scope.showSearchView = false;
		}*/
	};

	$scope.convertObjToArray = function(objToIterate) {
		for (var key in objToIterate) {
			//console.log("Key: ", key);
			if (typeof key === undefined)
				return;
			else if (objToIterate.hasOwnProperty(key)) {
				//console.log("Value: ", objToIterate[key]);

				//if (typeof objToIterate[key] === 'number') {
					//console.log("End of the line");
					//$scope.catArray.push(objToIterate[key]);
				//}
				//else {
				$scope.clickedList[key] = false;
				$scope.showPlus[key] = false;
				$scope.addedSymps[key] = "";
				$scope.modalSeverities[key] = 0;
				$scope.catArray.push(key);
				$scope.convertObjToArray(objToIterate[key]);					
				//}
				if (typeof objToIterate[key] === 'number' || typeof objToIterate[key] === 'string') {
					$scope.symList.push(key);
					$scope.symptomIds[key] = objToIterate[key];
					$scope.searchList.push({'name': key});
					$scope.showPlus[key] = true;
				}
			}
			else {
				$scope.catArray.push(key);
			}
		}
	};

	$scope.buildSearchList = function(symptomObj) {
		var tempHistory = [];
		$scope.convertObjToArray(symptomObj);
		//console.log("Symptom List: ", $scope.symList);
		//$scope.leftView = $scope.getSymCategories(symptomObj);
		var topLevel = $scope.getSymCategories(symptomObj);
		$scope.leftView = symptomObj;
		$scope.rightView = topSymptoms;
		$scope.selectedCategory.value = -1;
		//$scope.rightView = symptomObj[topLevel[0]];
		//$scope.selectedCategory.value = topLevel[0];
		//console.log("leftView: ", $scope.leftView);
		$scope.deleteListFromList($scope.catArray, topLevel);
		//console.log("Full List: ", $scope.catArray);
		tempHistory.push($scope.leftView);		
		tempHistory.push($scope.rightView);
		$scope.historyStack.push(tempHistory);
		$scope.clickStack.push("Top 5");
		//$scope.clickStack.push(topLevel[0]);
		//console.log("Build History: ", $scope.historyStack);
	};

	$scope.getSymCategories = function(symObj) {
		if (Object.keys(symObj).length > 0 || Array.isArray(symObj)) {
			var tempList = [];

			if (Array.isArray(symObj) && typeof symObj[0] !== undefined) {
				return undefined;
				/*for (var key in symObj) {
					tempList.push(symObj[key]);
				}*/
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

	$scope.deleteListFromList = function(sourceList, deletionList) {
		for (var index in deletionList) {
			var idx = sourceList.indexOf(deletionList[index]);
			if (idx >= 0) {
				sourceList.splice(idx, 1);
			}
		}
	};

	$scope.isThingInObj = function (objToCheck, listOfThings) {
		//console.log("Object To Check: ", objToCheck);
		for (var index in listOfThings) {
			//console.log("Thing: ", listOfThings[index]);
			if (typeof objToCheck !== undefined && typeof listOfThings[index] !== undefined && typeof index !== undefined &&
				objToCheck !== undefined && listOfThings[index] !== undefined && index !== undefined) {
				if (objToCheck.hasOwnProperty(listOfThings[index])) {
					return true;
					//console.log("Has own property: TRUE, ", listOfThings[index]);
				}
				/*if (listOfThings[index] in objToCheck) {
					console.log("Thing in Object: TRUE, ", listOfThings[index]);
				}*/
			}
		}
		return false;
	};

	$scope.getSymptomId = function (symptom) {
		return $scope.symptomIds[symptom];
	};

	$scope.buildSearchList($scope.symptoms);

}]);