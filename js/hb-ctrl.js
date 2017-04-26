'use strict';
angular.module('myApp')
    .controller('hbCtrl', function ($scope, $rootScope) {
    $rootScope.nastia = "Сируха";
        $rootScope.audioScore = 0;
        $rootScope.tim = "";

        $rootScope.login = function (username, password) {
            if (username == "сируха" && password=="korona18"){
            console.log(window.location);
               window.location.hash = "#/gosha";}
            else  if (username == "сируха" && password !="korona18")
                alert("Не вірний пароль");
            else  if (username != "сируха" && password =="korona18")
                alert("Не вірний логін");
            else
                alert("Не вірний пароль і логін");
        };

        $rootScope.audioTrue = function() {
            $rootScope.audioScore = $rootScope.audioScore +1 ;
            alert("Всьо ок :))))") ;
        };

        $rootScope.audioFalse = function() {
            alert("Не вірно, спробуй ще :))))") ;
        };

        $rootScope.audio = function() {
            if($rootScope.audioScore > 5)
            alert("Ти гарно знаєш улюблені пісні :))))") ;
            else
            alert("стид-позор ти не пам'ятаєш пісень");
        };

        $rootScope.timYes = function() {
            $rootScope.tim = " ТИ ВИГРАЛА СУПЕР-ГРУ))))";
            $rootScope.tim1 = " Твій приз лежить під подушкою в кімнаті)))";
        };

        $rootScope.timNo = function() {
            $rootScope.tim = " Нажаль ти програла супер-гру(((((";
            $rootScope.tim1 = "  Приходь наступного року ;)ЬЬЬ";
        };

        $rootScope.timHelp = function() {
            $rootScope.tim = "";
            $rootScope.tim1 = " Загугли і не позорь мене)))";
        };

        $rootScope.gosha = function(value) {
            if (value == "pineapple")
            window.location.hash  = "#/ballon";
            else alert("Погано ти знаєш англійську аяяй ((")
        };

        $rootScope.ballon = function(value) {
            if (value == 7)
                window.location.hash  = "#/balk";
            else alert("не вірно")
        };
        $rootScope.balk = function(value) {
            if (value == "ананас")
                window.location.hash  = "#/mmm";
            else alert("уважно розгадуй")
        };
        $rootScope.mmm = function(value) {
            if (value == "інжир")
                window.location.hash  = "#/hist";
            else alert("попробуй ще раз")
        };
        $rootScope.hist = function(value) {
            if (value == "часи")
                window.location.hash  = "#/sherlok";
            else alert("попробуй ще раз")
        };
        $rootScope.sherlok = function(value) {
            if (value == "2")
                window.location.hash  = "#/music";
            else alert("попробуй ще раз")
        };
});