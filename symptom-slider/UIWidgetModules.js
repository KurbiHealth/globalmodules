'use strict';

angular.module('ui.WellnessSlider', [])
	.directive('ringSlider', function () {
		return {
			restrict: 'A',
			replace: true,
			templateUrl: 'modules/symptom-slider/templates/RingSliderWidget.html',
			scope: {
				//ringSlider: "&",
				//severityNum: '=',
				//sliderPosition: "="
			},
			link: function (scope, element, attrs) {
				var mDownSlider = false;
				var mMoveSlider = false;
				var mdown = false;
				var degree = 0;
				scope.displayOnly = angular.isDefined(attrs.displayOnly); //Set in view if widget is used in display only mode, cant move slider

				//Reference to widget container, max size
			    var $container = element;
			    var $inside = element.find('.innerCircle');
			    var $slider = element.find('.rotationSlider');

			    var $slice1 = element.find('.slice1');
			    var $slice2 = element.find('.slice2');
			    var $slice3 = element.find('.slice3');

	            //Grab severity number by setting <severity-num="someValue"> in view
	            if (angular.isDefined(attrs.severityNum))
	            {
//console.log("Severity passed in: ", scope.severityNum);
console.log('scope',scope.$parent.card.severity);
	            	//degree = scope.severityNum;
	            	degree = scope.$parent.card.severity;
	            	scope.sliderPosition = scope.$parent.card.severity;
	            	$slider[0].style.cursor = 'default';
	            }
	            else
	            {
	            	//scope.sliderPosition = degree;
	            	degree = scope.$parent.card.severity;
	            	scope.sliderPosition = scope.$parent.card.severity;
	            }
	            //Set default styles of our slider widget
	            setWidgetStyles(degree);

			    //Get widget sizes for calculating coordinates
			    var sliderWidth = $slider.width();
			    var sliderHeight = $slider.height();
			    var outterRad = $container.width()/2;
			    var innerRad = $inside.width()/2;
			    
			    var refRad = (outterRad - innerRad)/2 + innerRad;

			    //Calculate default location of slider, top center or 90 deg
			    setSliderPosition(degree);

			    //Mouse Events
			    $slider
			    .mousedown(function (e) {
			    	if(!scope.displayOnly)
			    	{
			    		mDownSlider = true;
			    		e.originalEvent.preventDefault();			    		
			    	}
			    })
			    .mouseup(function (e) {
			    	mDownSlider = false;
			    	mMoveSlider = false;
			    })
			    .mousemove(function (e) {
			        if(!scope.displayOnly && mDownSlider)
			        {
			        	mMoveSlider = true;
			        }
			    });
			    
			    $container
			    .mousedown(function (e) {
			    	if (!scope.displayOnly && !mDownSlider && !(typeof e.target.offsetLeft === "undefined" || typeof e.target.offsetTop === "undefined")) {
				    	mdown = true;
				    	e.originalEvent.preventDefault();

				    	degree = calculateMousePos(e, mMoveSlider);

				        scope.sliderPosition = setWidgetStyles(degree);

				        //Calculate the slider location
				        setSliderPosition(degree);
					}
			    })
			    .mouseup(function (e) { 
			    	mdown = false;
			    	mDownSlider = false;
			    	mMoveSlider = false;			    	
			    })
			    .mousemove(function (e) {
			        if(!scope.displayOnly && mMoveSlider && !(typeof e.target.offsetLeft === "undefined" || typeof e.target.offsetTop === "undefined"))
			        {
			        	degree = calculateMousePos(e, mMoveSlider);

				        scope.sliderPosition = setWidgetStyles(degree);

				        //Calculate the slider location
				        setSliderPosition(degree);
			        }
			    });

				function calculateMousePos(evnt, mouseMov)
				{
					//Firefox compatibility
				    if(typeof evnt.offsetX === "undefined" || typeof evnt.offsetY === "undefined") {
				        var targetOffset = $(evnt.target).offset();
				        evnt.offsetX = evnt.pageX - targetOffset.left;
				        evnt.offsetY = evnt.pageY - targetOffset.top;
				    }

				    //Based on mouse position during mouse down event, calculate coordinates
				    if (!mouseMov)
				    	var mPos = {x: evnt.offsetX, y: evnt.offsetY};
				    else
				    	var mPos = {x: evnt.target.offsetLeft + evnt.offsetX, y: evnt.target.offsetTop + evnt.offsetY};
				    
				    //Calculate location degree
				    var atan = Math.atan2(mPos.x-outterRad, mPos.y-outterRad);
				    var deg = Math.round(-atan/(Math.PI/180) + 180); // final (0-360 positive) degrees from mouse position
				            
				    //For attraction to multiples of 30 degrees so we hit the mid points between severities
				    var dist = Math.abs( deg - ( Math.round(deg / 30) * 30 ) );

				    if( dist <= 2 )
				        deg = Math.round(deg / 30) * 30;
				                
				    if(deg == 360)
				        deg = 0;

				    return deg	
				}

				function setWidgetStyles(deg)
				{
				    //Make it easier to set widget styles based on degrees
				    //ffeb99, #ffd27f, #ffff99, #ff9999			    
				    if (deg >= 0 && deg < 120)
				    {
				        scope.severityText = "Mild";
				        $inside.html('Mild');
				        $inside[0].style.color = 'green';
				        $slider[0].style.backgroundColor = 'green';
						$slice1[0].style.fill = 'green';
						$slice2[0].style.fill = '#ffe67f';
						$slice3[0].style.fill = '#ff9999';
				    }
				    else if (deg >= 120 && deg < 240)
				    {
				        scope.severityText = "Moderate";
				        $inside.html('Moderate');
				    	$inside[0].style.color = '#ffce00';
				        $slider[0].style.backgroundColor = '#ffce00';
						$slice1[0].style.fill = '#99cc99';
						$slice2[0].style.fill = '#ffce00';
						$slice3[0].style.fill = '#ff9999';
				    }
				    else if (deg >= 240 && deg < 360)
				    {
				        scope.severityText = "Severe";
				        $inside.html('Severe');
						$inside[0].style.color = 'red';
				        $slider[0].style.backgroundColor = 'red';
						$slice1[0].style.fill = '#99cc99';
						$slice2[0].style.fill = '#ffe67f';
						$slice3[0].style.fill = 'red';
				    }
				    else 
				    {
				       	//Should never get here, log error/return?
				       	if(scope.displayOnly)
				       		deg = 0;
				       	else
				       	{
					       	//Just in case lets put the last value back in
					        deg = scope.sliderPosition;				       		
				       	}
				    }
				    return deg;
				}

				function setSliderPosition(deg)
				{
					/*Calculation for ending coordinates
					x = cx + r * cos(a)
					y = cy + r * sin(a)
					Calculate the Point P on circle
					x^2 + y^2 = r^2 
					*/			    
				    var X = Math.round(refRad* Math.sin(deg*Math.PI/180));
				    var Y = Math.round(refRad*  -Math.cos(deg*Math.PI/180));				    
					var sliderX = X+outterRad-sliderWidth/2;
					var sliderY = Y+outterRad-sliderHeight/2;
				    
				    $slider.css({ left: sliderX, top: sliderY });					
				}
			}
		};
	});