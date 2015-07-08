/* Directives */

angular.module('CardsModule', [])
 
.directive('card', function ($http,$compile,$timeout){

	return {
		restrict: 'A',
        controller: 'CardController',
		link: function(scope, element, attrs) {
			var rootDirectory = 'modules/cards/templates/';
	        var template = '';

	        switch(scope.card.type) {
	            case 'image-card':
	                template = 'image-card.html';
	                break;
	            case 'text-card':
	                template = 'text-card.html';
	                break;
	            case 'symptom-card':
	                template = 'symptom-card.html';
	                break;
	        }
	        
	        $http.get(rootDirectory + template).then(function(response){
	        	element.html(response.data).show();
	        	$compile(element.contents())(scope);
	        	// add a binding to make card-reverse work
	        	editButton = element.find('card-title i');
	        	//editButton.bind()
	        });
	    }
	};
})

.directive("emitWhen", function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var params = scope.$eval(attrs.emitWhen),
                event = params.event,
                condition = params.condition;
            if(condition){
                scope.$emit(event);
            }
        }
    }
});