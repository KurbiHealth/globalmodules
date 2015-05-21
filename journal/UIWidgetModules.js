'use strict';

angular.module('ui.WellnessSlider', [])
	.directive('ringSlider', function () {
		return {
			restrict: 'A',
			replace: true,
			templateUrl: '../partials/RingSliderWidget.html',
			scope: {},
			controller: function ($scope) {
				/*
				Calculation for ending coordinates
				x = cx + r * cos(a)
				y = cy + r * sin(a)
				Calculate the Point P on circle
				x^2 + y^2 = r^2
				*/
				$scope.severityText = "Mild";
			    var $container = $('.outterCircle');
			    var $middle = $('.middleCircle')
			    var $inside = $('.innerCircle');
			    var $slider = $('#rotationSlider');
			    
			    var sliderWidth = $slider.width();
			    var sliderHeight = $slider.height();
			    var outterRad = $container.width()/2;
			    var innerRad = $inside.width()/2;
			    var middleRad = $middle.width()/2;
			    var refRad = 105;
			    var deg = 90;

			   	var mc = document.getElementById("outterCircle");
				var b = document.body;
				var l = mc.getBoundingClientRect().left;
				var t = mc.getBoundingClientRect().top;
				var cX = l + outterRad;
				var cY = t + outterRad;

			    var X = Math.round(refRad* Math.cos(deg*Math.PI/180));
			    var Y = Math.round(refRad* -Math.sin(deg*Math.PI/180));
			    var leftPos = X+outterRad-sliderWidth/2;
			    var topPos = Y+outterRad-sliderHeight/2;
			    console.log("Left: ", leftPos);
			    console.log("Top: ", topPos);
				var sliderX = leftPos;
				var sliderY = topPos;			    
			    $slider.css({ left: leftPos, top: topPos });
			    
			    var mdown = false;
			    $container
			    .mousedown(function (e) { 
			    	mdown = true; 
			    	e.originalEvent.preventDefault();

			        // firefox compatibility
			        if(typeof e.offsetX === "undefined" || typeof e.offsetY === "undefined") {
			            var targetOffset = $(e.target).offset();
			            e.offsetX = e.pageX - targetOffset.left;
			            e.offsetY = e.pageY - targetOffset.top;
			        }
			        console.log("offsetX: ", e.offsetX);
			        console.log("offsetY: ", e.offsetY);
			        console.log("targetOffsetLeft: ", e.target.offsetLeft);
			        console.log("targetOffsetTop: ", e.target.offsetTop);
			        console.log("targetOffset.Left: ", $(e.target).offset().left);
			        console.log("targetOffset.Top: ", $(e.target).offset().top);			        

			        var mPos = {x: e.offsetX + l, y: e.offsetY + t};

			        var adjacent = -(cX - mPos.x);
			        var opposite = -(mPos.y - cY);
			        var at = Math.atan2(opposite, adjacent);
			        deg = at/(Math.PI/180); // final (0-360 positive) degrees from mouse position

			        if (deg < 0)
			        	deg = deg + 360;

				    X = Math.round(refRad* Math.cos(deg*Math.PI/180));
				    Y = Math.round(refRad* -Math.sin(deg*Math.PI/180));
				    sliderX = X+outterRad-sliderWidth/2;
				    sliderY = Y+outterRad-sliderHeight/2;
				    console.log("adjacent: ", adjacent);
				    console.log("opposite: ", opposite);
				    console.log("deg: ", deg);
				    console.log("l: ", l);
				    console.log("t: ", t);
				    console.log("cX: ", cX);
				    console.log("cY: ", cY);
				    console.log("Y: ", sliderY);
				    console.log("X: ", sliderX);
				    console.log("pageY: ", e.pageY);
				    $slider.css({ left: sliderX, top: sliderY });
			    })
			    .mouseup(function (e) { mdown = false; })
			    .mousemove(function (e) {
			        if(mdown)
			        {   
			            // firefox compatibility
			            if(typeof e.offsetX === "undefined" || typeof e.offsetY === "undefined") {
			               var targetOffset = $(e.target).offset();
			               e.offsetX = e.pageX - targetOffset.left;
			               e.offsetY = e.pageY - targetOffset.top;
			            }
			            
				        var mPos = {x: e.offsetX + l, y: e.offsetY + t};

				        var adjacent = -(cX - mPos.x);
				        var opposite = -(mPos.y - cY);
				        var at = Math.atan2(opposite, adjacent);
				        deg = at/(Math.PI/180); // final (0-360 positive) degrees from mouse position

				        if (deg < 0)
				        	deg = deg + 360;

			            // for attraction to multiple of 90 degrees
			            var distance = Math.abs( deg - ( Math.round(deg / 90) * 90 ) );
			            
			            if( distance <= 5 )
			                deg = Math.round(deg / 90) * 90;
			                
			            if(deg == 360)
			                deg = 0;
			            console.log("Rounded Degree: ", deg);
			            
					    X = Math.round(refRad* Math.cos(deg*Math.PI/180));
					    Y = Math.round(refRad* -Math.sin(deg*Math.PI/180));
					    sliderX = X+outterRad-sliderWidth/2;
					    sliderY = Y+outterRad-sliderHeight/2;

					    console.log("adjacent: ", adjacent);
					    console.log("opposite: ", opposite);

			            $slider.css({ left: sliderX, top: sliderY });
			            
			            var roundDeg = Math.round(deg);
			        }
			    });
			}
		};
	});