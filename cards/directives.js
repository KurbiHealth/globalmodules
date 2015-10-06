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
	        	// Card Types for Journal
	            case 'image-card':
	                template = 'image-card.html';
	                break;
	            case 'text-card':
	                template = 'text-card.html';
	                break;
	            case 'symptom-card':
	                template = 'symptom-card.html';
	                break;
	            // Card Types for Live Chart
	            case 'aaa-card':
	                template = 'live-chart-card.html';
	                break;
	            case 'conditions-card':
	            	template = 'live-chart-conditions-card.html';
	            	break;
	            case 'immunizations-card':
	                template = 'live-chart-card.html';
	                break;
	            case 'labs-card':
	                template = 'live-chart-card.html';
	                break;
	            case 'meds-card':
	                template = 'live-chart-card.html';
	                break;
	            case 'notifications-card':
	                template = 'live-chart-card.html';
	                break;
	            case 'planOfCare-card':
	                template = 'live-chart-card.html';
	                break;
	            case 'procedures-card':
	                template = 'live-chart-card.html';
	                break;
	            case 'social-card':
	                template = 'live-chart-card.html';
	                break;
	            case 'vitalSigns-card':
	                template = 'live-chart-card.html';
	                break;
	            case 'post-card':
	                template = 'post-card.html';
	                break;
	            default:
	            	template = 'text-card.html';
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

.directive("emitWhen", function($timeout){
    return {
        restrict: 'A',
       /* scope: {
        	$last: '@'
        },*/
        link: function(scope, element, attrs) {
            var params = scope.$eval(attrs.emitWhen),
                event = params.event;
                //,
                //first = params.conditionFirst,
                //last = params.conditionLast;
//console.log('event', event);
//console.log(scope);
//console.log(scope.$parent.$last);
			if(event == 'renderingCard'){
				if(scope.$last === true){
console.log('------', scope.$last, scope.$parent.$last);
console.log(scope);
//console.log(scope.$parent.$last);
					$timeout(function () {
	                    scope.$emit('allRendered');
	                });
				}
			}
        }
    }
});