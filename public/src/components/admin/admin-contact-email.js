moviePitchApp.directive('adminContactEmail', function(){
	return {
		controller: function($scope, adminFactory, emailFactory){
			// Define Scope Variables;
			$scope.emails = [];
			$scope.newAdminEmail = "";

			$scope.refreshEmails = function(){
				adminFactory.getAdminEmails()
					.then(function(resp){
						$scope.emails = resp.data;
					})
					.catch(function(err){
						console.error(err);
					});
			};

			$scope.addAdmin = function(){

				adminFactory.addAdminEmail($scope.newAdminEmail)
					.then(function(resp){
						$scope.newAdminEmail = "";
						$scope.refreshEmails();
					})
					.catch(function(err){
						console.error(err)
					});
			};

			$scope.removeAdmin = function(id){
				let emailAddress = $scope.emails[id].email_address;

				adminFactory.removeAdminEmail(emailAddress)
					.then(function(resp){
						$scope.refreshEmails();
					})
					.catch(function(err){
						console.error(err);
					});
			}

			// Init Page
			$scope.refreshEmails();
		},
		link: function(scope, el, attrs){
			$(el).find('')
		},
		restrict: "A",
		templateUrl: "dist/components/admin/admin-contact-email.html"
	};
});