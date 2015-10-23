kurbiApp.controller('CardControllerInit', ['api','$scope',
	'$timeout','$q','$element','$modal',
function(api,$scope,$timeout,$q,$element,$modal){

	api.getJournalCards($q.defer())
	.then(
		function(data){
			$scope.journalEntries = data;
			console.log("Data: ", data);
			if(data[0].today == false){
				var today = new Date;
				$scope.journalEntries.unshift({
					date: today.toDateString(),
					components: []
				});
			}
		},
		function(error){
			console.log(error);
		}
	);

	$scope.$on('allRendered', function(){
		// the "allRendered" event is supposed to broadcast when the 
		// cards are done being rendered, but there still is a brief
		// time between when the directive is done rendering and when
		// the Masonry will work, hence the $timeout
		$timeout(function(){
			$('.journal-day').masonry(
			{
				itemSelector: '.card',
				columnWidth: '.card',
				isFitWidth: true,
				stamp: '.journal-day-header'
			}
			); 
		},150);
	});

	$scope.addCard = function(type,date){
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: 'myModalContent.html',
			controller: 'ModalInstanceCtrl',
			//size: size,
			resolve: {
			  /*items: function () {
			    return $scope.items;
			  }*/
			}
		});

		// get values from edit form
		var tableName = 'symptom',
			dataObj = {
				//'' = ''
			},
			tableId = 1;
		
		// save a new entry to db
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

		// save a new entry-type to db

		// add new card to UI		
		$scope.journalEntries[0].components.unshift(
			{id: 100, 'type': type, title: 'New Card'}
		);

		// update the masonry grid layout
		$timeout(function(){
			$('.journal-day').masonry('reloadItems');
			$('.journal-day').masonry('layout');
		},650);

		//$scope.showModal = true;
		//$scope.addSymptomCard();
	}

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

	$scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: 'upload/url',
                    fields: {'username': $scope.username},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                });
            }
        }
    };

	$scope.open = function (size) {

	  var modalInstance = $modal.open({
	    animation: true,
	    templateUrl: 'myModalContent.html',
	    controller: 'ModalInstanceCtrl',
	    size: size,
	    resolve: {
	      /*items: function () {
	        return $scope.items;
	      }*/
	    }
	  });

	  /*modalInstance.result.then(function (selectedItem) {
	    $scope.selected = selectedItem;
	  }, function () {
	    $log.info('Modal dismissed at: ' + new Date());
	  });*/

	}; // end $scope.open()

	/*$scope.toggleAnimation = function () {
	  $scope.animationsEnabled = !$scope.animationsEnabled;
	};*/

}]);


kurbiApp.controller('CardController', ['$scope', '$locale', 'api',
function($scope, $locale, api){
	$scope.addSymptomCard = function(api)
	{
		//$scope.showModal = true;
	};

	// this is called in the directives.js file

}]);

kurbiApp.controller('SymptomCardController', ['$scope', '$locale','api',
function($scope, $locale,api){

	console.log("Symptom Controller");
	$scope.reversed = true;
	$scope.saved = false;
	$scope.severity = 0;
	$scope.timeSaved = $scope.day.date;
	$scope.defaultSlider = "default";
	$scope.grabSlider = "grab";
	//$scope.directiveDelegate = {};

    $scope.onEditClick = function(sliderStyle)
    {
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
    	$scope.onEditClick("default");
    	$scope.saved = true;    	
    	//console.log("Directive sev: ", sev);
		//console.log('saving severity: ', $scope.card.severity);
		$scope.card.severity = sev;
		$scope.timeSaved = Date.now();
		//$scope.directiveDelegate.invoke();
    };

	$scope.ok = function() {
	  $scope.showModal = false;
	};

	$scope.cancel = function() {
	  $scope.showModal = false;
	};

}]);

kurbiApp.controller('ModalInstanceCtrl', ['$scope', '$locale', 'api', '$modalInstance',
function($scope, $locale, api, $modalInstance){
	console.log("ModalInstanceCtrl");
	$scope.firstClicked = false;
	$scope.backClicked = false;
	$scope.closeOthers = true;
	$scope.disable = {value:true};
	$scope.status = {open:false};
	$scope.showPlus = false;
	$scope.clickedList = {};
	$scope.currentCat = "";
	$scope.showCategory = false;
	$scope.selectedCategory = {value: -1};
	$scope.rightView = {};
	$scope.leftView = {};
	$scope.catArray = [];
	$scope.symList = [];
	$scope.historyStack = [];
	$scope.lastClick = "";
	$scope.showSearchView = false;
	$scope.symptoms = {
		'Head': {
			'Eyes': {
				'Blurry Vision':1, 
				'Double Vision':2, 
				'Uncontrolled Watering':3, 
				'Dry Eyes':4, 
				'Itchy Eyes':5
			},
			'Ears': {
				'Ear Ache':6
			},
			'Nose': {
				'Runny Nose':7
			},
			'Jaw': {
				'Clicking':8
			},
			'Face': {
				'Sunburn':9
			},
			'Scalp': {
				'Itchy':10
			},
			'Brain': {
				'Migraine':11
			}
		},
		'Neck': {
			'Throat': {
				'Sore Throat':12
			}
		},
		'Torso': {
			'Stomach': {
				'Gas':13
			}
		},
		'Arms': {
			'Elbow': {
				'Burning':14
			}
		},
		'Back': {
			'Spine': {
				'Inflamation':15
			}
		},
		'Hips': {
			'Joint': {
				'Pain':16
			}
		},
		'Knees': {
			'Cap': {
				'Swelling':17
			}
		},
		'Feet': {
			'Heel': {
				'Stinging':18
			}
		}
	};

	//$scope.currentLeftView = $scope.symptoms;
	//$scope.nextleftView = $scope.symptoms;

	$scope.clickLeftView = function(index, category) {
		$scope.backClicked = false;
		var tempHistory = [];
		var historyCopy = [];
		var lastView = [];
		var lastLeft = {};
		var lastRight = {};
		//console.log("rightView: ", $scope.currentRightView);
		//console.log("leftView: ", $scope.currentLeftView);	
		
		$scope.selectedCategory.value = index;
		$scope.showCategory = true;
		$scope.currentCat = category;

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
			if ($scope.isThingInObj($scope.rightView, $scope.symList)) {
				$scope.showPlus = true;
				$scope.disable.value = false;
			}
			else {
				$scope.showPlus = false;
				$scope.disable.value = true;
			}
			//$scope.rightView = newView;
			//$scope.currentRightView = $scope.currentLeftView[category];

			tempHistory.push($scope.leftView);
			tempHistory.push($scope.rightView);
			$scope.historyStack.push(tempHistory);
			//$scope.$apply();
			//$scope.nextleftView = $scope.currentLeftView[category];
			console.log("Left History: ", $scope.historyStack);
			console.log("Left: ", $scope.leftView);
			console.log("Right: ", $scope.rightView);			
			//console.log("rightView: ", $scope.currentRightView);
			//console.log("leftView: ", $scope.currentLeftView);
		}
	};

	$scope.clickRightView = function(index, symptom) {
		//console.log("rightView: ", $scope.currentRightView);
		//console.log("leftView: ", $scope.currentLeftView);		
		//var newView = $scope.getSymCategories($scope.currentRightView);
		$scope.backClicked = false;
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
			$scope.selectedCategory.value = index;
			$scope.currentCat = symptom;
			//$scope.currentLeftView = $scope.currentRightView;

			//newView = $scope.getSymCategories($scope.currentRightView[symptom]);
			//newView = $scope.currentRightView[symptom];
			console.log("IF1");
			//if (newView !== undefined) {
				//console.log("IF2");
				$scope.rightView = newView;

				tempHistory.push($scope.leftView);
				tempHistory.push($scope.rightView);
				$scope.historyStack.push(tempHistory);
				console.log("Right History: ", $scope.historyStack);
				console.log("Left: ", $scope.leftView);
				console.log("Right: ", $scope.rightView);
			/*}
			else if ($scope.currentRightView[symptom] !== undefined) {
				console.log("ELSEIF1");
				//console.log("current left: ", $scope.currentRightView[symptom]);
				$scope.rightView = $scope.currentRightView[symptom];
				$scope.currentRightView = $scope.currentLeftView[symptom];
			}*/

			if ($scope.isThingInObj($scope.rightView, $scope.symList)) {
				console.log("IF3");
				$scope.showPlus = true;
				$scope.disable.value = false;
				if ($scope.firstClicked) {
					console.log("IF4");
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
					console.log("ELSE3");
					$scope.firstClicked = true;
				}
			}
			else {
				console.log("ELSE2");
				$scope.showPlus = false;
				$scope.disable.value = true;
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
			console.log("ELSE1: ");
			//closed.value = !closed.value;
			//console.log("ELSE1: ", closed.value);
			$scope.showPlus = true;
			$scope.disable.value = false;
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

	$scope.ok = function () {
		//$scope.$apply();
		$modalInstance.close();
	};

	$scope.cancel = function () {
	  $modalInstance.dismiss('cancel');
	};

	$scope.clickBack = function () {
		if ($scope.historyStack.length > 1) {
			var lastView = $scope.historyStack.pop();
			if (!$scope.backClicked) {
				$scope.backClicked = true;
				if ($scope.historyStack.length > 1) {
					lastView = $scope.historyStack.pop();
				}
			}
			console.log("Last Left: ", lastView[0]);
			console.log("Last Right: ", lastView[1]);
			if (lastView[1] !== undefined && lastView[1].length > 0) {
				$scope.leftView = lastView[0];
				$scope.rightView = lastView[1];			
			}
		}
	};

	$scope.modalSearchChange = function (change) {
		if ($scope.symptomSearch.length > 0 && change !== "blur") {
			$scope.showSearchView = true;
		}
		else {
			$scope.showSearchView = false;
		}
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
				$scope.catArray.push(key);
				$scope.convertObjToArray(objToIterate[key]);					
				//}
				if (typeof objToIterate[key] === 'number' || typeof objToIterate[key] === 'string') {
					$scope.symList.push(key);
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
		//console.log("leftView: ", $scope.leftView);
		$scope.deleteListFromList($scope.catArray, topLevel);
		//console.log("Full List: ", $scope.catArray);
		tempHistory.push($scope.leftView);		
		tempHistory.push($scope.rightView);
		$scope.historyStack.push(tempHistory);
		console.log("Build History: ", $scope.historyStack);
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

	$scope.buildSearchList($scope.symptoms);

}]);