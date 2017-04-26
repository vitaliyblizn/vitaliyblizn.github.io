'use strict';
angular.module('myApp')
    .controller('bankCtrl', function ($scope, $rootScope) {

        var coef = {
            age: 0.01,
            isWoman: 0.4,
            live: 0.042,
            profRisk: {
                high: 0,
                low: 0.55,
                else: 0.16
            },
            experience: 0.059,
            hasBankAcc: 0.45,
            hasRealty: 0.35,
            hasInsurance: 0.19,
            maxCount: {
                age: 0.3,
                live: 0.42,
                experience: 0.59
            }
        };

        initProfessions();
        initDefaultClientInfo();

        $scope.check = function (client) {
            var result = 0;
            client.age = calculateAge(client.dateBirthday);
            if (client.age > 20) {
                var ageCoefCount = (client.age - 20) * coef.age;
                result += ageCoefCount > coef.maxCount.age ? coef.maxCount.age : ageCoefCount;
            }
            if (client.sex == "Woman") result += coef.isWoman;
            console.log(client.prof);

            result += client.prof.risk;
            var countExperience = client.experience * coef.experience;
            result += countExperience > coef.maxCount.experience ? coef.maxCount.experience : countExperience;
            if(client.hasBankAcc) result += coef.hasBankAcc;
            if(client.hasRealty) result += coef.hasRealty;
            if(client.hasInsurance) result += coef.hasInsurance;
            client.solvency = result;
            window.location.hash  = "#/result";
        };


        function calculateAge(birthday) { // birthday is a date
            var ageDifMs = Date.now() - birthday.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        };
        function initProfessions() {
// TODO change list professions from http://www.education.ua/ua/professions/
            $rootScope.professions = [
                Profession("Будівельник", coef.profRisk.high),
                Profession("Слюсар", coef.profRisk.high),
                Profession("Електрик", coef.profRisk.high),
                Profession("Бухгалтер", coef.profRisk.else),
                Profession("Програміст", coef.profRisk.low),
                Profession("Лікар", coef.profRisk.else),
                Profession("Вчитель", coef.profRisk.else),
                Profession("Продавець", coef.profRisk.low)
            ];
        };
        function initDefaultClientInfo() {
            $scope.client = {};
            $scope.client.sex = "Man";
            $scope.client.dateBirthday = new Date();
            $scope.client.hasBankAcc = false;
            $scope.client.hasRealty = false;
            $scope.client.hasInsurance = false;
        };
        function Profession(name, risk) {
            var prof = {};
            prof.name=name;
            prof.risk = risk;
            return prof;
        };
    });