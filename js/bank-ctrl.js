'use strict';
angular.module('myApp')
    .controller('bankCtrl',  function ($scope, $rootScope) {
        $scope.config = {
            title: 'Result',
            tooltips: true,
            labels: false,
            mouseover: function() {},
            mouseout: function() {},
            click: function() {},
            legend: {
                display: true,
                //could be 'left, right'
                position: 'right'
            },
            colors: [	'#FF7F50', '#9370DB']
        };

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
        initAppIndicators();
        initDefaultClientInfo();

        $scope.checkDuran = function (client) {
            var duranCoef = {
                sex: {
                    client : 0,
                    max: 0
                },
                age: {
                    client : 0,
                    max: 0
                },
                profRisk: {
                    client : 0,
                    max: 0
                },
                experience: {
                    client : 0,
                    max: 0
                },
                hasBankAcc: {
                    client : 0,
                    max: 0
                },
                hasRealty: {
                    client : 0,
                    max: 0
                },
                hasInsurance: {
                    client : 0,
                    max: 0
                }
            };
            var result = 0;
            client.age = calculateAge(client.dateBirthday);
            if (client.age > 20) {
                duranCoef.age.max = coef.maxCount.age;
                var ageCoefCount = (client.age - 20) * coef.age;
                duranCoef.age.client = ageCoefCount;
                result += ageCoefCount > coef.maxCount.age ? coef.maxCount.age : ageCoefCount;
            }
            duranCoef.sex.client = 0;
            if (client.sex == "Woman"){
                result += coef.isWoman;
                duranCoef.sex.client = coef.isWoman;
            }
            duranCoef.sex.max = coef.isWoman;
            console.log(client.prof);

            duranCoef.profRisk.client = client.prof.risk;
            duranCoef.profRisk.max = coef.profRisk.low;
            result += client.prof.risk;
            var countExperience = client.experience * coef.experience;
            var countedExperience = countExperience > coef.maxCount.experience ? coef.maxCount.experience : countExperience;
            result += countedExperience;
            duranCoef.experience.client = countedExperience;
            duranCoef.experience.max = coef.maxCount.experience;
            duranCoef.hasBankAcc.client =0;
            duranCoef.hasBankAcc.max =coef.hasBankAcc;
            duranCoef.hasRealty.client =0;
            duranCoef.hasRealty.max =coef.hasRealty;
            duranCoef.hasInsurance.client =0;
            duranCoef.hasInsurance.max =coef.hasInsurance;
            if(client.hasBankAcc){
                result += coef.hasBankAcc;
                duranCoef.hasBankAcc.client = coef.hasBankAcc;
            }
            if(client.hasRealty) {
                result += coef.hasRealty;
                duranCoef.hasRealty.client =coef.hasRealty;
            }
            if(client.hasInsurance) {
                result += coef.hasInsurance;
                duranCoef.hasInsurance.client =coef.hasInsurance;
            }
            client.solvency = {};
            client.solvency.result = result;
            client.solvency.coef = 1.25;
            $scope.showChart=true;
            $scope.data = {
                series: ['User', 'Max'],
                data: [{
                    x: "Стать",
                    y: [duranCoef.sex.client, duranCoef.sex.max]
                }, {
                    x: "Вік",
                    y: [duranCoef.age.client, duranCoef.age.max]
                }, {
                    x: "Професія",
                    y: [duranCoef.profRisk.client, duranCoef.profRisk.max]
                }, {
                    x: "Стаж",
                    y: [duranCoef.experience.client, duranCoef.experience.max]
                }, {
                    x: "Рахунок",
                    y: [duranCoef.hasBankAcc.client, duranCoef.hasBankAcc.max]
                }, {
                    x: "Нерухомість",
                    y: [duranCoef.hasRealty.client, duranCoef.hasRealty.max]
                }, {
                    x: "Страхування",
                    y: [duranCoef.hasInsurance.client, duranCoef.hasInsurance.max]
                }]
            };
            window.location.hash  = "#/result";

        };
        $scope.checkIndicators = function (client) {
            var result = 0;

                var dataResult = [];
            client.indicators.forEach(function ($item,ind) {
                var currentResult = $item.weight * $item.chosen.coef;
                result += currentResult;
                console.log($item);
                var variantMax = 0;
                $item.variants.forEach(function($item1){
                    if($item1.coef > variantMax){
                        variantMax = $item1.coef;
                    }
                });
                var currentData = {
                    x: ind,
                    // x: $item.name,
                    y :[currentResult, variantMax*$item.weight],
                    tooltip: $item.name
                };
                dataResult.push(currentData)
            });
            $scope.data = {
                series: ['User', 'Max'],
                data: dataResult};
            client.solvency = {};
            client.solvency.result =  result / $scope.maxWeight;
            client.solvency.coef = 0.5;

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
            $scope.client.indicators = $scope.indicators;

        };
        function Profession(name, risk) {
            var prof = {};
            prof.name=name;
            prof.risk = risk;
            return prof;
        };
        function initAppIndicators() {
            $scope.indicators = [
                Indicator("Вік",5,[
                    Variant("До 20 років",0),
                    Variant("Від 20 до 30",0.6),
                    Variant("Від 30 до 50",1),
                    Variant("Понад 50",0.4)
                ]),
                Indicator("Тривалість проживання в конкретній місцевості",3,[
                    Variant("До 1 року",0),
                    Variant("Від 1 до 5 років",0.4),
                    Variant("Від 5 до 7 років",0.8),
                    Variant("Понад 7",1)
                ]),
                Indicator("Рівень освіти",4,[
                    Variant("Середня",0.2),
                    Variant("Середня-спеціальна",0.4),
                    Variant("Середньо-технічна(технікум)",0.6),
                    Variant("Вища",1)
                ]),
                Indicator("Освіта",2,[
                    Variant("Технічна",0.6),
                    Variant("Медична",0.8),
                    Variant("Економічна",1),
                    Variant("Юридична",1),
                    Variant("Інша",0.4)
                ]),
                Indicator("Місце роботи",5,[
                    Variant("Тимчасово не працює",0),
                    Variant("Пенсіонер",0.2),
                    Variant("Студент денної форми",0.3),
                    Variant("Державна установа",0.4),
                    Variant("Приватне підприємство",0.6),
                    Variant("Підприємство недержавної форми власності",0.7),
                    Variant("Підприємство зі 100% іноземним капіталом; іноземні представництва",1)
                ]),
                Indicator("Посада",3,[
                    Variant("Відсутня",0),
                    Variant("Виконавець",0.3),
                    Variant("Крівник структурного підрозділу; заступник керівника",0.7),
                    Variant("Керівик; приватний підприємець; засновник",1)
                ]),
                Indicator("Стаж роботи",4,[
                    Variant("До 1 року",0),
                    Variant("Від 1 до 5 років",0.2),
                    Variant("Від 5 до 7 років",0.5),
                    Variant("Понад 7 років",1)
                ]),
                Indicator("Сімейний стан",2,[
                    Variant("Неодружений/незаміжня без дітей ",0.5),
                    Variant("Неодружений/незаміжня з дітьми",0),
                    Variant("Одружений/заміжня без дітей",0.8),
                    Variant("Одружений/заміжня з дітьми",1)
                ]),
                Indicator("Джерела погашння кредиту",6,[
                    Variant("Офіційна ЗП та інші доходи, що документально підтверджені",1),
                    Variant("Стабільні додаткові доходи",0.6),
                    Variant("Нестаільні додаткові доходи(сезонні роботи тощо)",0.2)
                ]),
                Indicator("Кредитна історія",10,[
                    Variant("Позичальник раніше користувався кредитом у даному банку і не порушував терміни його погашення(є документи)",1),
                    Variant("Позичальник раніше користувався кредитом у іншому банку і не порушував терміни його погашення(є документи)",0.9),
                    Variant("Позичальник на даний момент користувався кредитом. Кредитна історія позитина(є документи)",0.7),
                    Variant("Кредитна історія відсутня",0.5),
                    Variant("Негативна кредитна історія",-1)
                ]),
                Indicator("Володіння нерухомістю, що підтвердується документами на право власності",5,[
                    Variant("Відсутнє",0),
                    Variant("Квартира, житловий будинок у місті районного значення чи селищі (володіння спільне)",0.3),
                    Variant("Квартира, житловий будинок у місті районного значення чи селищі (володіння особисте)",0.4),
                    Variant("Квартира, житловий будинок у місті обласного значення (володіння спільне)",0.5),
                    Variant("Квартира, житловий будинок у місті обласного значення (володіння особисте)",0.7),
                    Variant("Квартира, житловий будинок у місті-міліоннику (володіння особисте)",0.9),
                    Variant("Квартира, житловий будинок у місті-міліоннику (володіння особисте)",1)
                ]),
                Indicator("Володіння автомобілем",3,[
                    Variant("Немає",0),
                    Variant("Вартістю до 3000$",0),
                    Variant("Від 3000 до 10 000$",0.4),
                    Variant("Від 10 000 до 30 000$",0.7),
                    Variant("Понад 30 000$",1)
                ]),
                Indicator("Наявність документально підтверджених депозитних рахунків у банках",4,[
                    Variant("Немає",0),
                    Variant("На суму, що еквівалентна 500$",0.3),
                    Variant("На суму, що еквівалентна від 500 до 5000$",0.6),
                    Variant("На суму, що еквівалентна від 5000 до 10 000$",0.8),
                    Variant("На суму, що еквівалентна понад 10 000$",1)
                ]),
                Indicator("Мета кредитування",5,[
                    Variant("Придбання житла",1),
                    Variant("Придбання автомобіля",1),
                    Variant("Купівля споживчих товарів",0.5),
                    Variant("Кредит на інші цілі під заставу нерухомості",0.7),
                    Variant("Кредит на інші цілі під поруку",0.1),
                    Variant("Кредит під поруку, бланковий кредит",0)
                ]),
                Indicator("Срок кредитування",3,[
                    Variant("До 1 року",1),
                    Variant("Від 1 до 3 років",0.8),
                    Variant("Від 3 до 5 років",0.6),
                    Variant("Від 5 до 10 років",0.4),
                    Variant("Від 10 до 15 років",0.2),
                    Variant("Понад 15 років",0)
                ]),
                Indicator("Сума кредиту",3,[
                    Variant("Від 10 000 до 20 000$",1),
                    Variant("Від 20 000 до 30 000$ (Київський регіон)",1),
                    Variant("Від 20 000 до 50 000$",0.9),
                    Variant("Від 30 000 до 60 000$ (Київський регіон)",0.8),
                    Variant("Від 50 000 до 80 000$",0.7),
                    Variant("Від 60 000 до 100 000$ (Київський регіон)",0.5),
                    Variant("Від 80 000 до 100 000$",0.3),
                    Variant("Понад 100 000",0.1)
                ]),
                Indicator("Забезпечення",6,[
                    Variant("Грошові кошти, розміщені на депозитному рахунку у даному банку",1),
                    Variant("Нерухоме майно у власності",0.9),
                    Variant("Нерухомість, що купується позичальником",0.8),
                    Variant("Автомобіль",0.6),
                    Variant("Інше майно",0.3),
                    Variant("Порука юридичної особи - клієта даного банку",0.2),
                    Variant("Порука фізичної особи",0.1),
                    Variant("Відсутнє",0)
                ]),
                Indicator("Наявність додаткової поруки",4,[
                    Variant("Фізична особа (документально підтверджені доходи)",1),
                    Variant("Юридична особа (документально підтверджені доходи)",0.8),
                    Variant("Інша порука",0.1),
                    Variant("Відсутність поруки",0)
                ])
            ];
            var result = 0;
            $scope.indicators.forEach(function ($item) {
                result += $item.weight;
            });
            $scope.maxWeight = result;
        };
        function Indicator(name, weight, variants) {
            var indicator = {};
            indicator.name = name;
            indicator.weight = weight;
            indicator.variants = variants;
            indicator.chosen = false;
            return indicator;
        };
        function Variant(name, coef) {
            var variant = {};
            variant.name = name;
            variant.coef = coef;
            return variant;
        };
    });