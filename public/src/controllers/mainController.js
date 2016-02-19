moviePitchApp.controller('MainController', ['$scope', '$timeout', '$state',
  function($scope, $timeout, $state) {

    $scope.$on('logged-in', function(resp){
      $scope.showLogout = "logout--show";
    });

    $scope.$on('logged-out', function(resp){
      $scope.showLogout = "";
    });

    $scope.logoutUser = function(){
      $scope.showLogout = "";
      $scope.$broadcast('logout-user');
      $state.go('index');
    }
  }
]);



