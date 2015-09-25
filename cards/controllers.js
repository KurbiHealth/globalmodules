kurbiApp.controller('CardControllerInit', ['api','$scope',
	'$timeout','$q',
function(api,$scope,$timeout,$q){

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
		},450);
	});

	$scope.addCard = function(type,date){
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

}]);


kurbiApp.controller('CardController', [
function(){

	// this is called in the directives.js file

}]);

kurbiApp.controller('SymptomCardController', ['$scope', '$locale',
function($scope, $locale){
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
    }

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

}]);