kurbiApp.controller('UploadController', ['$state','$rootScope','$scope', 'posts', 
	'api', 'user', '$q','cloudinary',
function ($state,$rootScope,$scope, posts, api, user, $q, cloudinary) {

	// =====================
	// UPLOADING FILES (IMG)
	// =====================

	$scope.myKurbiFile = '';

	// WHAT WORKS
	/*
	$scope.$watch doesn't work on change, but works when the Submit button is hit
	hitting the Submit button and triggering saveUploadedFile() works, the () gets both the passed param 
	and the $scope variable
	*/
	$scope.saveUploadedFile = function(file){

		var myFile = $scope.myKurbiFile;

		cloudinary.upload(myFile, {})
		.then(function (resp) {

			// save the response to db with api.addRecord()
			api.addImage(resp.data)
			.then(function(data){
				// add to $scope.journalEntries
				$scope.journalEntries[0].push({
					'title': 'Image',
					'imageUrl': data
				});
				// refresh $state.reload()
				$scope.reload();
			});

			$modalInstance.close(dataObjList);
			// $modalInstance.dismiss('cancel');

			// update the card in the UI (an img card)
			// 1) may need to start with a function in CardController which triggers off the flyout
			// 2) here, set a $rootScope value for currentImageCloudinaryPublicId, then pass controll back to CardController
			// 3) in CardController, create a new card using $rootScope.currentImageCloudinaryPublicId, using <img /> below (?)
			// OR
			// just save to db, insert to $scope.journalEntries, and then do $state.reload()
			
		});
	};

	$scope.closeModalOnSave = function(){
		// do I need this function???
	}

	$scope.updateImage = function(file,reversed){
console.log(reversed);
		reversed = !reversed;
	}

	$scope.$watch('myFile', function(myFile) { 	
		// 'myFile' is not an event, it's a scope variable, which apparently is being set by ng-file-upload (?)
		// I left this code in here cause it's how the author of the cloudinary directive that we're using (says to 
		// to use for catching and triggering file uploads to Cloudinary), so I left as reference. It didn't work for 
		// me, so I used the saveUploadedFile() function above which I was able to get working. -Matt Eckman 11/6/2015
	});

}]);