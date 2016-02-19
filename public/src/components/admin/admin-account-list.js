moviePitchApp.directive('adminAccountList', function(){
	return {
		controller: function($scope, adminFactory){
			// get a list of admin Accounts
			adminFactory.getAllAccounts()
				.then(resp => {
					$scope.admins = resp.data
				})
				.catch(err => {
					console.log(err)
				});
		},
		restrict: "A"
	}
});