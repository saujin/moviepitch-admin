"use strict";

require('angular');
require('angular-ui-router');

var controllerArray = ["ui.router"];

var moviePitchApp = angular.module("moviePitchApp", controllerArray).config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  // Main Nav
  $stateProvider.state('index', {
    url: "/",
    templateUrl: "views/login.html",
    data: {
      requireLogin: false
    }
  }).state('admin', {
    url: "/admin",
    templateUrl: "views/admin.html",
    data: {
      requireLogin: true
    }
  }).state('admin-manage', {
    url: "/admin/manage-admins",
    templateUrl: "views/admin/manage-admins.html",
    data: {
      requireLogin: true
    }
  }).state('admin-notifications', {
    url: "/admin/mail-notifications",
    templateUrl: "views/admin/mail-notifications.html",
    data: {
      requireLogin: true
    }
  }).state('admin-unreviewed', {
    url: "/admin/pitches",
    templateUrl: "views/admin/unreviewed-pitches.html",
    data: {
      requireLogin: true
    }
  }).state('admin-under-consideration', {
    url: "/admin/pitches/under-consideration",
    templateUrl: "views/admin/under-consideration-pitches.html",
    data: {
      requireLogin: true
    }
  }).state('admin-in-negotiation', {
    url: "/admin/pitches/in-negotiation",
    templateUrl: "views/admin/in-negotiation-pitches.html",
    data: {
      requireLogin: true
    }
  }).state('admin-sold', {
    url: "/admin/pitches/sold",
    templateUrl: "views/admin/sold-pitches.html",
    data: {
      requireLogin: true
    }
  }).state('admin-rejected', {
    url: "/admin/pitches/rejected",
    templateUrl: "views/admin/rejected-pitches.html",
    data: {
      requireLogin: true
    }
  });
}]).run(function ($rootScope, $state) {
  $rootScope.curUser = null;

  $rootScope.$on('$stateChangeStart', function (event, toState) {
    var requireLogin = toState.data.requireLogin;

    if (requireLogin === true && $rootScope.curUser === null) {
      event.preventDefault();
      $rootScope.targetState = toState.name;
      $state.go('index');
    }

    if (toState.name === "index" && $rootScope.curUser !== null) {
      event.preventDefault();
      $rootScope.targetState = "admin";
      $state.go('admin');
    }
  });
});
'use strict';

moviePitchApp.controller('AdminController', ['$scope', '$rootScope', 'adminFactory', '$state', 'pitchFactory', '$http', '$timeout', function ($scope, $rootScope, adminFactory, $state, pitchFactory, $http, $timeout) {

	$scope.isMobileNavOpen = "";
	$scope.toggleMobileNav = function () {
		$scope.isMobileNavOpen = $scope.isMobileNavOpen === "" ? "section-content-nav--is-shown" : "";
	};

	function clearFields() {
		$scope.adminUsernameRegister = "";
		$scope.adminEmailRegister = "";
		$scope.adminPasswordRegister = "";
		$scope.adminPasswordRegisterConfirm = "";
	}

	// Login an Admin
	$scope.adminEmail = "j@j.com";
	$scope.adminPassword = "test";

	$scope.loginAdmin = function () {

		adminFactory.loginAdmin($scope.adminEmail, $scope.adminPassword).then(function (resp) {
			$http.defaults.headers.common.Authorization = "JWT " + resp.data.token;
			$rootScope.curUser = resp.data.token;

			$scope.$emit('logged-in', resp);

			if ($rootScope.targetState === "" || $rootScope.targetState === undefined) {
				$state.go('admin');
			} else {
				$state.go($rootScope.targetState);
			}

			$rootScope.targetState = "";
		}).catch(function (err) {
			console.log(err);
		});
	};

	$scope.$on('logout-user', function () {
		$scope.logoutAdmin();
	});

	// Logout an Admin
	$scope.logoutAdmin = function () {
		$http.defaults.headers.common.Authorization = "";

		adminFactory.logoutAdmin().then(function (resp) {
			console.log('Logging out');
		}).catch(function (err) {
			console.log(err);
		});
	};

	// Register an Admin
	clearFields();

	$scope.registerAdmin = function () {
		if ($scope.adminUsernameRegister === "" || $scope.adminEmailRegister === "" || $scope.adminPasswordRegister === "" || $scope.adminPasswordRegisterConfirm === "") {
			$scope.notification = "Please fill out all the fields to register an admin.";
		} else if ($scope.adminPasswordRegister !== $scope.adminPasswordRegisterConfirm) {
			$scope.notification = 'The passwords do not match.';
		} else {
			var data = {
				name: $scope.adminUsernameRegister,
				email: $scope.adminEmailRegister,
				password: $scope.adminPasswordRegister
			};

			adminFactory.registerAdmin(data).then(function (resp) {
				clearFields();
				$scope.notification = "Account created.";
				$timeout(function () {
					$scope.notification = "";
				}, 3000);
				console.log(resp);
			}).catch(function (err) {
				console.log(err.data.message);
				$scope.notification = err.data.message;
			});
		}
	};
}]);
'use strict';

moviePitchApp.controller('MainController', ['$scope', '$timeout', '$state', function ($scope, $timeout, $state) {

  $scope.$on('logged-in', function (resp) {
    $scope.showLogout = "logout--show";
  });

  $scope.$on('logged-out', function (resp) {
    $scope.showLogout = "";
  });

  $scope.logoutUser = function () {
    $scope.showLogout = "";
    $scope.$broadcast('logout-user');
    $state.go('index');
  };
}]);
"use strict";

moviePitchApp.factory('adminFactory', function ($http, $q, $rootScope) {
  var urlBase = "https://moviepitchapi.herokuapp.com";

  var testUser = {
    name: "Justin Tulk",
    email: "justintulk@gmail.com",
    pwd: "testPassword"
  };

  var factory = {
    getAllAccounts: function getAllAccounts() {
      return $http({
        method: "GET",
        url: urlBase + "/admin/users"
      });
    },

    getAdminEmails: function getAdminEmails() {
      return $http({
        method: "GET",
        url: urlBase + "/admin/destination_emails"
      });
    },

    addAdminEmail: function addAdminEmail(email) {
      return $http({
        method: "POST",
        url: urlBase + "/admin/add_destination_email/",
        data: {
          email_address: email
        }
      });
    },

    removeAdminEmail: function removeAdminEmail(email) {
      return $http({
        method: "GET",
        url: urlBase + "/admin/remove_email/" + email
      });
    },

    loginAdmin: function loginAdmin(email, pwd) {
      return $http({
        method: "POST",
        url: urlBase + "/admin/login",
        data: {
          email: email,
          password: pwd
        }
      });
    },

    logoutAdmin: function logoutAdmin() {
      var deferred = $q.defer();

      $rootScope.curUser = null;

      if ($rootScope.curUser === null) {
        deferred.resolve({
          status: "Success",
          message: "User is logged out"
        });
      } else {
        deferred.reject({
          status: "Logout error",
          message: "User is still logged in"
        });
      }

      return deferred.promise;
    },

    registerAdmin: function registerAdmin(data) {
      return $http({
        method: "POST",
        url: urlBase + "/admin/register",
        data: {
          name: data.name,
          email: data.email,
          password: data.password
        }
      });
    },

    testLoginAdmin: function testLoginAdmin() {
      return $http({
        method: "POST",
        url: urlBase + '/admin/login',
        data: {
          email: testUser.email,
          password: testUser.pwd
        }
      });
    },

    testRegisterAdmin: function testRegisterAdmin() {
      return $http({
        method: "POST",
        url: urlBase + '/admin/register',
        data: {
          name: testUser.name,
          email: testUser.email,
          password: testUser.pwd
        }
      });
    }
  };

  return factory;
});
"use strict";

moviePitchApp.factory('emailFactory', function ($q, $http) {
  var urlBase = "https://moviepitchapi.herokuapp.com";

  var factory = {

    sendContactUsMessage: function sendContactUsMessage(name, email, subject, msg) {

      return $http({
        method: "POST",
        url: urlBase + "/contact/",
        data: {
          name: name,
          email: email,
          subject: subject,
          message: msg
        }
      });
    },

    validateEmail: function validateEmail(email) {
      var deferred = $q.defer();

      var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

      if (reg.test(email)) {
        deferred.resolve(true);
      } else {
        deferred.reject(false);
      }

      return deferred.promise;
    }
  };

  return factory;
});
"use strict";

moviePitchApp.factory('pitchFactory', function ($q, $http, $rootScope) {
  var urlBase = "https://moviepitchapi.herokuapp.com";

  var factory = {

    acceptPitch: function acceptPitch(id) {
      return $http({
        type: "GET",
        url: urlBase + "/pitch/accept/" + id
      });
    },

    getAllPitches: function getAllPitches() {
      return $http({
        method: "GET",
        url: urlBase + "/pitch"
      });
    },

    getPitchesByFilter: function getPitchesByFilter(filterString) {

      return $http({
        method: "GET",
        url: urlBase + "/pitch?" + filterString
      });
    },

    getPitchByID: function getPitchByID(id) {
      return $http({
        method: "GET",
        url: urlBase + '/pitch/' + id
      });
    },

    lockPitch: function lockPitch(id) {
      return $http({
        method: "GET",
        url: urlBase + "/pitch/lock/" + id
      });
    },

    rejectPitch: function rejectPitch(id) {
      return $http({
        type: "GET",
        url: urlBase + "/pitch/reject/" + id
      });
    },

    submitPitch: function submitPitch(pitch) {
      return $http({
        method: "POST",
        url: urlBase + "/pitch",
        data: pitch
      });
    },

    updatePitchStatus: function updatePitchStatus(id, status) {
      var validStatuses = ["created", "rejected", "pending", "accepted"];
      var testResults = false;

      // test each valid status against passed in status
      validStatuses.forEach(function (val, index, arr) {
        if (val === status) {
          testResults = true;
        }
      });

      // proceed if status matches any valid status
      if (testResults === true) {
        return $http({
          method: "PUT",
          url: urlBase + "/pitch/update/" + id,
          data: {
            status: status
          }
        });
      }

      // throw a promise error back test fails
      else {
          var deferred = $q.defer();
          deferred.reject({
            status: "Error",
            message: status + " is not a valid status"
          });
          return deferred.promise;
        }
    },

    validatePitch: function validatePitch(pitch) {
      // console.log(pitch);
      var deferred = $q.defer();

      console.log(pitch);
      if (pitch.userHasAcceptedTerms === true && pitch.pitchText !== "" && pitch.genre !== "Select Genre" && pitch.genre !== "") {
        pitch.status = "created";
        pitch.userHasAcceptedTime = new Date();

        deferred.resolve({
          status: "success",
          pitch: pitch
        });
      } else if (pitch.pitchText === "" && pitch.userHasAcceptedTerms === false && pitch.genre === "Select Genre") {
        deferred.reject({
          status: "error",
          errorCode: 1000,
          msg: "Please fill out the pitch form before submitting."
        });
      } else if (pitch.genre === "" || pitch.genre === "Select Genre") {
        deferred.reject({
          status: "error",
          errorCode: 1001,
          msg: "Please select a genre."
        });
      } else if (pitch.pitchText === "" || pitch.pitchText === null) {
        deferred.reject({
          status: "error",
          errorCode: 1002,
          msg: "Please write your movie idea in the textarea."
        });
      } else if (pitch.userHasAcceptedTerms === false) {
        deferred.reject({
          status: "error",
          errorCode: 1003,
          msg: "Please accept the terms in order to continue."
        });
      } else {
        deferred.reject({
          status: "error",
          errorCode: 1010,
          msg: "Something has gone wrong. Please refresh the page."
        });
      }

      return deferred.promise;
    }
  };

  return factory;
});
"use strict";

moviePitchApp.factory('userFactory', function ($q, $rootScope, $location) {
  var factory = {
    checkLoggedIn: function checkLoggedIn() {
      var deferred = $q.defer();

      if ($rootScope.curUser === null) {
        console.log('1');
        deferred.reject();
        $location.url('/login');
      } else {
        console.log('2');
        deferred.resolve();
      }

      return deferred.promise;
    },
    loginUser: function loginUser(username, pwd) {
      var deferred = $q.defer();

      Parse.User.logIn(username, pwd).then(function (user) {
        $rootScope.curUser = user;

        deferred.resolve({
          status: "success",
          data: user
        });
        $rootScope.$broadcast('login-update');
      }, function (err) {
        deferred.reject({
          status: "error",
          error: err
        });
      });

      return deferred.promise;
    },

    logoutUser: function logoutUser() {
      var deferred = $q.defer();
      Parse.User.logOut();

      var user = Parse.User.current();

      if (user === null) {
        // Remove the user from the $rootScope
        $rootScope.curUser = null;
        $rootScope.$broadcast('logout-update');
        deferred.resolve({
          status: "success",
          msg: "User is logged out"
        });
      } else {
        deferred.reject({
          status: "error",
          msg: "User is still logged in"
        });
      }

      return deferred.promise;
    },

    signUp: function signUp(username, email, pwd) {
      var deferred = $q.defer();

      var user = new Parse.User();
      user.set("username", username);
      user.set("email", email);
      user.set("password", pwd);

      user.signUp(null, {
        success: function success(user) {
          deferred.resolve({
            status: "success",
            data: user
          });
          console.log(Parse.User.current());
        },
        error: function error(user, err) {
          console.log(err);
          deferred.reject({
            status: "error",
            user: user,
            error: err
          });
        }
      });

      return deferred.promise;
    }
  };

  return factory;
});
"use strict";

moviePitchApp.directive('adminAccountList', function () {
	return {
		controller: function controller($scope, adminFactory) {
			// get a list of admin Accounts
			adminFactory.getAllAccounts().then(function (resp) {
				$scope.admins = resp.data;
			}).catch(function (err) {
				console.log(err);
			});
		},
		restrict: "A"
	};
});
"use strict";

moviePitchApp.directive('adminContactEmail', function () {
	return {
		controller: function controller($scope, adminFactory, emailFactory) {
			// Define Scope Variables;
			$scope.emails = [];
			$scope.newAdminEmail = "";

			$scope.refreshEmails = function () {
				adminFactory.getAdminEmails().then(function (resp) {
					console.log(resp);
					$scope.emails = resp.data;
				}).catch(function (err) {
					console.log(err);
				});
			};

			$scope.addAdmin = function () {
				console.log($scope.newAdminEmail);

				adminFactory.addAdminEmail($scope.newAdminEmail).then(function (resp) {
					console.log(resp);
					$scope.newAdminEmail = "";
					$scope.refreshEmails();
				}).catch(function (err) {
					console.log(err);
				});
			};

			$scope.removeAdmin = function (id) {
				var emailAddress = $scope.emails[id].email_address;
				console.log(emailAddress);

				adminFactory.removeAdminEmail(emailAddress).then(function (resp) {
					console.log(resp);
					$scope.refreshEmails();
				}).catch(function (err) {
					console.log(err);
				});
			};

			// Init Page
			$scope.refreshEmails();
		},
		link: function link(scope, el, attrs) {
			$(el).find('');
		},
		restrict: "A",
		templateUrl: "dist/components/admin/admin-contact-email.html"
	};
});
'use strict';

moviePitchApp.directive('adminPitchList', function () {
	return {
		controller: function controller($scope, pitchFactory) {

			// Load all the unreviewed pitches
			$scope.getPitches = function (status) {
				// debugger;

				pitchFactory.getPitchesByFilter('status=' + status).then(function (resp) {
					// console.log(resp);
					$scope.pitches = resp.data.docs;
				}).catch(function (err) {
					console.log(err);
				});
			};

			// Reject a pitch by ID
			$scope.rejectPitch = function (id, status) {
				pitchFactory.rejectPitch(id).then(function (resp) {
					// console.log(resp);
					$scope.getPitches(status);
				}).catch(function (err) {
					console.log(err);
				});
			};

			$scope.updatePitch = function (id, data, status) {
				pitchFactory.updatePitchStatus(id, data).then(function (resp) {
					// console.log(resp);
					$scope.getPitches(status);
				}).catch(function (err) {
					console.log(err);
				});
			};
		},
		link: function link(scope, el, attrs) {
			// Load all the unreviewed pitches on init
			scope.getPitches(attrs.status);
		},
		restrict: "A"
	};
});
'use strict';

moviePitchApp.directive('adminPitch', function () {
	return {
		link: function link(scope, el, attrs) {
			$(el).find('.js-reject-unreviewed-pitch').on('click', function () {
				scope.updatePitch(attrs.id, 'rejected', 'unreviewed');
			});

			$(el).find('.js-accept-unreviewed-pitch').on('click', function () {
				scope.updatePitch(attrs.id, 'under_consideration', 'unreviewed');
			});

			$(el).find('.js-reject-under-consideration-pitch').on('click', function () {
				scope.updatePitch(attrs.id, 'rejected', 'under_consideration');
			});

			$(el).find('.js-negotiate-under-consideration-pitch').on('click', function () {
				scope.updatePitch(attrs.id, 'in_negotiation', 'under_consideration');
			});

			$(el).find('.js-reject-under-consideration-pitch').on('click', function () {
				scope.updatePitch(attrs.id, 'rejected', 'under_consideration');
			});

			$(el).find('.js-negotiate-under-consideration-pitch').on('click', function () {
				scope.updatePitch(attrs.id, 'in_negotiation', 'under_consideration');
			});

			$(el).find('.js-consider-rejected-pitch').on('click', function () {
				scope.updatePitch(attrs.id, 'under_consideration', 'rejected');
			});
		},
		restrict: "A"
	};
});
"use strict";

moviePitchApp.directive('appHeader', function ($state) {
  return {
    controller: function controller($scope) {
      $scope.menuToggleStatus = "menu-closed";
      $scope.currentLogAction = "show-login";

      $scope.toggleMenu = function () {
        $scope.menuToggleStatus = $scope.menuToggleStatus === "menu-closed" ? "menu-open" : "menu-closed";
      };
    },
    restrict: "A",
    templateUrl: "dist/components/nav/nav.html"
  };
});
'use strict';

moviePitchApp.directive('labelWrapper', function () {
  return {
    controller: function controller($scope) {
      $scope.labelState = "";
    },
    link: function link(scope, el, attrs) {
      var $inputs = el.find('input, select, textarea');
      var $label = el.find('label');

      $inputs.on('focus', function () {
        $label.addClass('label-wrapper-label--out');
      });

      $inputs.on('blur', function () {
        var value = $($inputs[0]).val();

        if (value === "") {
          $label.removeClass('label-wrapper-label--out');
        }
      });
    },
    restrict: "A"
  };
});