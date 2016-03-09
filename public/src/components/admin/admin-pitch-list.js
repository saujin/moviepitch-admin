moviePitchApp.directive('adminPitchList', function(){
	return {
		controller: function($scope, pitchFactory){

			// Load all the unreviewed pitches
			$scope.getPitches = function(status){
				pitchFactory
					.getPitchesByFilter('status=' + status)
					.then(function(resp){
						$scope.pitches = resp.data.docs;
					})
					.catch(function(err){
						console.log(err);
					});
			}

			// Accept a pitch by ID
			$scope.acceptPitch = function(id, oldStatus){
				pitchFactory.acceptPitch(id)
					.then(function(resp){
						$scope.getPitches(oldStatus);
					})
					.catch(function(err){
						console.log(err);
					});
			}

			// Reject a pitch by ID
			$scope.rejectPitch = function(id, oldStatus){
				pitchFactory.rejectPitch(id)
					.then(function(resp){
						$scope.getPitches(oldStatus);
					})
					.catch(function(err){
						console.log(err);
					});
			}

			$scope.updatePitch = function(id, data, oldStatus){
				pitchFactory.updatePitchStatus(id, data)
					.then(function(resp){
						$scope.getPitches(oldStatus);
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

