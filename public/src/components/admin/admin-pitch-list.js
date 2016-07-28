moviePitchApp.directive('adminPitchList', function(){
	return {
		controller: function($scope, pitchFactory){
			$scope.page = 1;	// what page the component starts on
			$scope.pages = 1;	// how many pages are total

			function _getPitches(status, num) {
				pitchFactory.getPitchesByFilter('status=' + status + '&page=' + num)
					.then(function(resp){
						$scope.pitches = resp.data.docs;
						$scope.pages = resp.data.pages;
					})
					.catch(function(err){
						console.error(err);
					});
			}

			$scope.prev = function(status){
				if($scope.page > 1) {
					$scope.page = $scope.page - 1;
					_getPitches(status, $scope.page)
				}
			}

			$scope.next = function(status){
				if($scope.page < $scope.pages) {
					$scope.page = $scope.page + 1;
					_getPitches(status, $scope.page)
				}
			}

			// Load all the unreviewed pitches
			$scope.getPitches = function(status, pageNum){
				if(pageNum === undefined) { pageNum = 1 }

				pitchFactory
					_getPitches(status, $scope.page)
			}

			// Accept a pitch by ID
			$scope.acceptPitch = function(id, oldStatus){
				pitchFactory.acceptPitch(id)
					.then(function(resp){
						$scope.getPitches(oldStatus);
					})
					.catch(function(err){
						console.error(err);
					});
			}

			// Reject a pitch by ID
			$scope.rejectPitch = function(id, oldStatus){
				pitchFactory.rejectPitch(id)
					.then(function(resp){
						$scope.getPitches(oldStatus);
					})
					.catch(function(err){
						console.error(err);
					});
			}

			$scope.updatePitch = function(id, data, oldStatus){
				pitchFactory.updatePitchStatus(id, data)
					.then(function(resp){
						$scope.getPitches(oldStatus);
					})
					.catch(function(err){
						console.error(err);
					})
			}

		},
		link: function(scope, el, attrs){
			// Load all the unreviewed pitches on init
			scope.getPitches(attrs.status, 1);

			var prevBtn = document.getElementById('prev-button')
			prevBtn.addEventListener('click', function(){
				scope.prev('rejected')
			})

			var nextBtn = document.getElementById('next-button')
			nextBtn.addEventListener('click', function(){
				scope.next('rejected')
			})
		},
		restrict: "A"
	}
});

