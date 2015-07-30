/* Directives */

angular.module('CardsModule', [])
 
.directive('card', function ($http,$compile,$timeout){

	return {
		restrict: 'A',
        controller: 'CardController',
		link: function(scope, element, attrs) {
			var rootDirectory = 'modules/cards/templates/';
	        var template = '';
//console.log('scope',scope);
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
	        	editButton = element.find('card-title i');
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