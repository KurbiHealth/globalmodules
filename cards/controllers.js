kurbiApp.controller('CardControllerInit', ['api','$scope', 
	'$timeout','$q','$modal',
function(api,$scope,$timeout,$q,$modal){
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
			$('.journal-day').masonry({
				itemSelector: '.card',
				//columnWidth: 280,
				isFitWidth: true,
				stamp: '.journal-day-header'
			});
		},50);
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
		
		// save a new entry to db

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
	};

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

kurbiApp.controller('SymptomCardController', ['$scope', '$locale', 'api',
function($scope, $locale, api){
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
    	$scope.saveSliderPosition();
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
	$scope.closeOthers = true;
	$scope.disable = true;
	$scope.open = false;
	$scope.currentCat = "";
	$scope.showCategory = false;
	$scope.selectedCategory = {value: -1};
	$scope.leftView = [];
	$scope.rightView = [];
	$scope.symArray = [];
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
	$scope.currentRightView = $scope.symptoms;
	//$scope.nextRightView = $scope.symptoms;

	$scope.clickRightView = function(index, category) {
		console.log("leftView: ", $scope.currentLeftView);
		console.log("rightView: ", $scope.currentRightView);	
		
		$scope.selectedCategory.value = index;
		$scope.showCategory = true;
		$scope.currentCat = category;
		
		//var newView = $scope.getSymCategories($scope.currentRightView[category]);
		$scope.leftView = $scope.currentRightView[category];
		//$scope.leftView = newView;
		$scope.currentLeftView = $scope.currentRightView[category];
		//$scope.$apply();
		//$scope.nextRightView = $scope.currentRightView[category];
		//console.log("Cat: ", category);
		console.log("leftView: ", $scope.currentLeftView);
		console.log("rightView: ", $scope.currentRightView);		
	};

	$scope.clickLeftView = function(index, symptom) {
		console.log("leftView: ", $scope.currentLeftView);
		console.log("rightView: ", $scope.currentRightView);		
		//var newView = $scope.getSymCategories($scope.currentLeftView);
		var newView = $scope.currentLeftView;

		if (typeof newView !== undefined && typeof newView !== 'number' && typeof newView !== 'string'
			&& typeof $scope.currentLeftView[symptom] !== undefined 
			&& typeof $scope.currentLeftView[symptom] !== 'number' && typeof $scope.currentLeftView[symptom] !== 'string') {
			$scope.rightView = newView;
			$scope.selectedCategory.value = index;
			$scope.currentCat = symptom;
			$scope.currentRightView = $scope.currentLeftView;

			//newView = $scope.getSymCategories($scope.currentLeftView[symptom]);
			newView = $scope.currentLeftView[symptom];
			if (newView !== undefined) {
				$scope.leftView = newView;
			}
			else {
				$scope.leftView = $scope.currentLeftView[symptom];
				$scope.currentLeftView = $scope.currentRightView[symptom];
			}
		}
		else {
			console.log("WE ARE HERE!");
			$scope.disable = false;
		}
		//$scope.$apply();
		console.log("leftView: ", $scope.currentLeftView);
		console.log("rightView: ", $scope.currentRightView);
		//$scope.rightSideObj = $scope.rightSideObj[symptom];
		//$scope.leftSide = [];
	};

	$scope.ok = function () {
		$scope.$apply();
	  //$modalInstance.close();
	};

	$scope.cancel = function () {
	  $modalInstance.dismiss('cancel');
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
					//$scope.symArray.push(objToIterate[key]);
				//}
				//else {
					$scope.symArray.push(key);
					$scope.convertObjToArray(objToIterate[key]);					
				//}
			}
			else {
				$scope.symArray.push(key);
			}
		}
	};

	$scope.buildSearchList = function(symptomObj) {
		$scope.convertObjToArray(symptomObj);
		//console.log("Full List: ", $scope.symArray);
		//$scope.rightView = $scope.getSymCategories(symptomObj);
		var topLevel = $scope.getSymCategories(symptomObj);
		$scope.rightView = symptomObj;
		//console.log("rightView: ", $scope.rightView);
		$scope.deleteListFromList($scope.symArray, topLevel);
		//console.log("Full List: ", $scope.symArray);
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

	$scope.buildSearchList($scope.symptoms);
}]);