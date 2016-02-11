moviePitchApp.directive('appHeader', function($state){
  return {
    controller: function($scope){
      $scope.menuToggleStatus = "menu-closed";
      $scope.currentLogAction = "show-login";

      $scope.toggleMenu = function(){
        $scope.menuToggleStatus = $scope.menuToggleStatus === "menu-closed" ? "menu-open" : "menu-closed";
      };

    },
    restrict: "A",
    templateUrl: "dist/components/nav/nav.html"
  }
});
