moviePitchApp.controller('MainController', ['$scope', 'ModalService', '$timeout', '$state',
  function($scope, ModalService, $timeout, $state) {
    $scope.isModalShown = "modal-hidden";

    $scope.$on('logged-in', function(resp){
      console.log('working');
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

    function openModalTasks(){
      $('.modal-close-animation').removeClass('modal-close-animation');
    }

    function closeModalTasks(modal){
      $scope.isModalShown ="modal-shown";
      modal.close.then(function(result) {
        $scope.isModalShown = "modal-hidden";
      });
    }

    function populateFancySelect(id){
      let $select = $(id);

      function selectReady() {
        let numOptions = $select.find('option').length;

        if (numOptions > 1) {
          $select.fancySelect();
        } else {
          $timeout(selectReady, 50);
        }
      }

      // The fancySelect function runs before the page
      // is fully loaded, hence the timeout function
      selectReady();
    }

    $scope.scrollToLink = function(id){
      let offset = $(id).offset().top;

      $('html, body').animate({
        scrollTop: offset
      }, 500);

      return false;
    }

    $scope.showPitchModal = function() {
      openModalTasks();

      ModalService.showModal({
        controller: "PitchModalController",
        templateUrl: "src/modals/pitch-modal/pitch-modal.html"
      })
        .then(function(modal) {
          populateFancySelect('#select-genre');
          closeModalTasks(modal);
        });
    };

    $scope.showExampleModal = function() {
      $('.modal-close-animation').removeClass('modal-close-animation');

      ModalService.showModal({
          controller: "CustomModalController",
          templateUrl: "src/modals/examples-modal/examples-modal.html"
        })
        .then(function(modal) {
          closeModalTasks(modal);
        });
    }
  }
]);



