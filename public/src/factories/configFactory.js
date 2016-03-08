moviePitchApp.factory('configFactory', function($http){
	const factory = {
		getAPIUrl: function(){
			return $http({
				type: "GET",
				url: "/api_url"
			})
		}
	}

	return factory;
})