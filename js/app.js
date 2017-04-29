'use strict';
angular.module("myApp", ["ngRoute"])
    .config( function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl : "view/main.html"
            })
            .when("/duran", {
                templateUrl : "view/duran.html"
            })
            .when("/indicators", {
                templateUrl : "view/indicators.html"
            })
            .when("/result", {
                templateUrl : "view/result.html"
            })
            .when("/login", {
                templateUrl : "view/login.html"
            });
    });