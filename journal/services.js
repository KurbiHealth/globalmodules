// GLOBAL JOURNAL ENTRIES OBJECT

kurbiApp.factory('journalEntriesSvc', ['api','$q', function (api,$q) {

	var journalEntriesObj = {

		journalEntries: [],

		init: function(){
			var promise = $q.defer();
			if(this.journalEntries.length == 0){
				api.getJournalCards($q.defer()).then(function(data){
					this.journalEntries = data;
					promise.resolve(this.journalEntries);
				});
			}else{
				promise.resolve(this.journalEntries);
			}
			return promise.promise;
		},

		get: function(){
			var promise = $q.defer();
			api.getJournalCards($q.defer()).then(function(data){
				this.journalEntries = data;
				promise.resolve(this.journalEntries);
			});
			return promise.promise;
		},

		addOne: function(newEntry){
			api.addJournalEntry(newEntry);
			return this.get;
		},

		updateOne: function(tableName,obj,id){
			var returnPromise = $q.defer();
			api.updateOne($q.defer(),tableName,obj,id).then(function(){
				returnPromise.resolve(this.get);
			});
			return returnPromise.promise;
		}

	};

	return journalEntriesObj;

}]);