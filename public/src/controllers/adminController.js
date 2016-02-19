moviePitchApp.controller('AdminController',
	['$scope', '$rootScope', 'adminFactory', '$state', 'pitchFactory', '$http', '$timeout',
	function($scope, $rootScope, adminFactory, $state, pitchFactory, $http, $timeout){


	$scope.isMobileNavOpen = "";
  $scope.toggleMobileNav = function(){
    $scope.isMobileNavOpen = $scope.isMobileNavOpen === "" ? "section-content-nav--is-shown" : "";
  }

	function clearFields(){
		$scope.adminUsernameRegister = "";
		$scope.adminEmailRegister = "";
		$scope.adminPasswordRegister = "";
		$scope.adminPasswordRegisterConfirm = "";
	}

	// Login an Admin
	$scope.adminEmail = "j@j.com";
	$scope.adminPassword = "test";

	$scope.loginAdmin = function(){

		adminFactory
			.loginAdmin($scope.adminEmail, $scope.adminPassword)
			.then(function(resp){
				$http.defaults.headers.common.Authorization = "JWT " + resp.data.token;
				$rootScope.curUser = resp.data.token;

				$scope.$emit('logged-in', resp);

				if($rootScope.targetState === "" || $rootScope.targetState === undefined){
					$state.go('admin');
				} else {
					$state.go($rootScope.targetState);
				}

				$rootScope.targetState = "";
			})
			.catch(function(err){
				console.log(err);
			});
	};

	$scope.$on('logout-user', function(){
		$scope.logoutAdmin();
	});

	// Logout an Admin
	$scope.logoutAdmin = function(){
		$http.defaults.headers.common.Authorization = "";

		adminFactory.logoutAdmin()
			.then(function(resp){
				console.log('Logging out');
			})
			.catch(function(err){
				console.log(err);
			});
	};

	// Register an Admin
	clearFields();

	$scope.registerAdmin = function(){
		if(
			$scope.adminUsernameRegister === "" ||
			$scope.adminEmailRegister === "" ||
			$scope.adminPasswordRegister === "" ||
			$scope.adminPasswordRegisterConfirm === ""
		) {
			$scope.notification = "Please fill out all the fields to register an admin."
		} else if(
			$scope.adminPasswordRegister !== $scope.adminPasswordRegisterConfirm
		){
			$scope.notification = 'The passwords do not match.';
		} else {
			const data = {
				name: $scope.adminUsernameRegister,
				email: $scope.adminEmailRegister,
				password: $scope.adminPasswordRegister
			};

			adminFactory.registerAdmin(data)
			.then(function(resp){
				clearFields();
				$scope.notification = "Account created."
				$timeout(function(){
					$scope.notification = "";
				}, 3000);
				console.log(resp);
			})
			.catch(function(err){
				console.log(err.data.message);
				$scope.notification = err.data.message;
			});
		}
	};
}]);