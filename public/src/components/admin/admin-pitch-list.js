moviePitchApp.directive('adminPitchList', function(){
	return {
		controller: function($scope, pitchFactory){

			// Load all the unreviewed pitches
			$scope.getPitches = function(status){
				// debugger;

				pitchFactory
					.getPitchesByFilter('status=' + status)
					.then(function(resp){
						console.log(resp);
						$scope.pitches = resp.data.docs;
					})
					.catch(function(err){
						console.log(err);
					});
			}

			// Reject a pitch by ID
			$scope.rejectPitch = function(id, status){
				pitchFactory.rejectPitch(id)
					.then(function(resp){
						console.log(resp);
						$scope.getPitches(status);
					})
					.catch(function(err){
						console.log(err);
					});
			}

			$scope.updatePitch = function(id, data, status){
				pitchFactory.updatePitchStatus(id, data)
					.then(function(resp){
						console.log(resp);
						$scope.getPitches(status);
					})
					.catch(function(err){
						console.log(err);
					})
			}

		},
		link: function(scope, el, attrs){
			// Load all the unreviewed pitches on init
			scope.getPitches(attrs.status);
		},
		restrict: "A"
	}
});

