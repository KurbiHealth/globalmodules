kurbiApp.controller('TempLiveChartControllerList', ['$scope','$http','api','$timeout',
function($scope,$http,api,$timeout){

	$scope.filterLiveChartBy = '';
	$scope.hiddenChart = 1;

	$scope.showChart = function(chart){
		if(chart == 0)
			$scope.hiddenChart = 1;
		if(chart == 1)
			$scope.hiddenChart = 0;
		//$('.cardContainer').masonry('reloadItems');
		//$('.cardContainer').masonry('layout');
		$timeout(function(){
//console.log('parsing live chart blocks');
			$('.cardContainer').masonry({
				itemSelector: '.block',
				columnWidth: .33
			});
		},10);
	}

	$scope.isHidden = function(type) {
	    if(type.toLowerCase().indexOf($scope.filterLiveChartBy) < 0) {
	        return true;
	    }
	    return false;
	}

	$scope.filterLiveChart = function(type){
		type = type.toLowerCase();
		if(type == 'all'){
			$scope.filterLiveChartBy = '';
		}else{
			$scope.filterLiveChartBy = type;
		}
		$timeout(function(){
//console.log('parsing live chart blocks');
			$('.cardContainer').masonry({
				itemSelector: '.block',
				columnWidth: .33
			});
		},10);
	}

	$timeout(function(){
//console.log('parsing live chart blocks');
		$('.cardContainer').masonry({
			itemSelector: '.block',
			columnWidth: .33
		});
	},400);

}]);

kurbiApp.controller('LiveChartControllerList', ['$scope','$http','api',
function($scope,$http,api){

	api.liveChartList()
	.then(function(data){
		$scope.liveChartList = data;
	})
	.catch(function(error){

	});

	$scope.filterLiveChartBy = '';

	$scope.filterLiveChart = function(type){
		type = type.toLowerCase();
		if(type == 'all'){
			$scope.filterLiveChartBy = '';
		}else{
			$scope.filterLiveChartBy = type;
		}
	}

	$scope.isHidden = function(card,type) {
	    if(card.type.toLowerCase().indexOf($scope.filterLiveChartBy) < 0) {
	        return true;
	    }
	    return false;
	}

	$scope.hiddenChart = 1;

	$scope.showChart = function(chart){
		if(chart == 0)
			$scope.hiddenChart = 1;
		if(chart == 1)
			$scope.hiddenChart = 0;
	}

}]);

kurbiApp.controller('LiveChartController', ['$scope','$http',
function($scope,$http){

	$http.get('/healthData.json').success(function(data) {
		$scope.healthData = data;

		// fix dates

		// process Labs & VitalSigns so they can be put into grid
		var labs = data.labs;
		var labGrid = [];
		var labGridHeader = [];
		var labGridSide = [];
		var items = {};

		// first pass, get dates
		angular.forEach(labs, function(lines) {
			angular.forEach(lines.items, function(line) {
				// line.date
				if(labGridHeader.indexOf(line.date) == -1){
					this.push(line.date);
				}
			}, labGridHeader);
		});
		labGridHeader.sort();

		// second pass, get item names 
		// name, range, unit
		angular.forEach(labs, function(lines) {
			angular.forEach(lines.items, function(line) {
				// line.name
				if(labGridSide.indexOf(line.name) == -1){
					this.push(line.name);
				}
			}, labGridSide);
		});
		labGridSide.sort();

		// 3rd pass, get individual items and put into arr
		angular.forEach(labGridSide,function(name){
			items[name] = [];
			angular.forEach(labs, function(lines) {
				angular.forEach(lines.items, function(line) {
					// line.name
					if(line.name == name){
						this.push(line);
					}
				}, items[name]);
			});
		});

		// 4th pass, put everything into grid and return		
		angular.forEach(labGridSide,function(name){
			var temp = [];
			var tempName = '';
			angular.forEach(labGridHeader,function(date){
				var counter = 0;
				angular.forEach(items[name],function(line){
					if(line.date == date){
						tempName = line.name + ' (' + line.range + ')';
						temp.push(line.value);
						counter++;
					}
				});
				if(counter == 0)
					temp.push('');
			});
			temp.unshift(tempName);
			this.push(temp);
		},labGrid);
		labGridHeader.unshift('');
		$scope.labGrid = labGrid;
		$scope.labGridHeader = labGridHeader;
	});
	

	$scope.addEntry = function(){

	};

}]);