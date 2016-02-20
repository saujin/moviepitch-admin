"use strict";

require('angular');
require('angular-ui-router');

const controllerArray = [
  "ui.router"
];

let moviePitchApp = angular.module("moviePitchApp", controllerArray)
  .config(["$stateProvider", "$urlRouterProvider",
    function($stateProvider, $urlRouterProvider){

      $urlRouterProvider.otherwise('/');

      // Main Nav
      $stateProvider
        .state('index', {
          url: "/",
          templateUrl: "views/login.html",
          data: {
            requireLogin: false
          }
        })
        .state('admin', {
          url: "/admin",
          templateUrl: "views/admin.html",
          data: {
            requireLogin: true
          }
        })
        .state('admin-manage', {
          url: "/admin/manage-admins",
          templateUrl: "views/admin/manage-admins.html",
          data: {
            requireLogin: true
          }
        })
        .state('admin-notifications', {
          url: "/admin/mail-notifications",
          templateUrl: "views/admin/mail-notifications.html",
          data: {
            requireLogin: true
          }
        })
        .state('admin-unreviewed', {
          url: "/admin/pitches",
          templateUrl: "views/admin/unreviewed-pitches.html",
          data: {
            requireLogin: true
          }
        })
        .state('admin-under-consideration', {
          url: "/admin/pitches/under-consideration",
          templateUrl: "views/admin/under-consideration-pitches.html",
          data: {
            requireLogin: true
          }
        })
        .state('admin-in-negotiation', {
          url: "/admin/pitches/in-negotiation",
          templateUrl: "views/admin/in-negotiation-pitches.html",
          data: {
            requireLogin: true
          }
        })
        .state('admin-sold', {
          url: "/admin/pitches/sold",
          templateUrl: "views/admin/sold-pitches.html",
          data: {
            requireLogin: true
          }
        })
        .state('admin-rejected', {
          url: "/admin/pitches/rejected",
          templateUrl: "views/admin/rejected-pitches.html",
          data: {
            requireLogin: true
          }
        });

    }
  ])
  .run(function($rootScope, $state, $http){
    $rootScope.curUser = null;

    $rootScope.$on('$stateChangeStart', function(event, toState){
      let requireLogin = toState.data.requireLogin;

      if(requireLogin === true){
        $http({
          method: "GET",
          url: "https://moviepitchapi.herokuapp.com/admin/check_auth"
        }).then(function(resp){
          // console.log(resp);
        }).catch(function(err){
          console.log(err);
          $rootScope.targetState = toState.name;
          $state.go('index');
        });
      }

      else if (toState.name === "index" && $rootScope.curUser !== null){
        event.preventDefault();
        $rootScope.targetState = "admin";
        $state.go('admin');
      }
    });
  });
