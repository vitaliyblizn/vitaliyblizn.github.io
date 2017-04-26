'use strict';
angular.module("myApp", ["ngRoute"])
    .config( function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl : "view/application.html"
            })
            .when("/result", {
                templateUrl : "view/result.html"
            })
            .when("/login", {
                templateUrl : "view/login.html"
            });
    });