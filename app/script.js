var app = angular.module('myApp', ['ngMessages', 'ngRoute', 'ngAnimate']);

app.config(function ($routeProvider) {
        $routeProvider.when('/details', {
                templateUrl: 'partials/details.html',
                controller: 'detailsController'
            })
            .when('/charges', {
                templateUrl: 'partials/charges.html',
                controller: 'chargesController'
            })
            .when('/earnings', {
                templateUrl: 'partials/earnings.html',
                controller: 'earningsController'
            })
            .otherwise({
                redirectTo: '/details'
            });
    })
    .run(function ($rootScope, $location, $timeout) {
        $rootScope.$on('$routeChangeError', function () {
            $location.path('/error');
        });
        $rootScope.$on('$routeChangeStart', function () {
            $rootScope.isLoading = true;
        });
        $rootScope.$on('$routeChangeSuccess', function () {
            $rootScope.isLoading = false;
        }, 2000);
    });



app.service('mealDataService', function () {

    var meals = [];

    var totals = {
        mealCount: 0,
        tipTotal: 0,
        tipAvg: 0
    };

    return {
        addMeal: function (meal) {
            meals.push(meal);
            totals.mealCount++;
            totals.tipTotal += meal.tipAmt;
            totals.tipAvg = (totals.tipTotal / totals.mealCount);
        },
        getMeals: function () {
            return meals;
        },
        getTotals: function () {
            return totals;
        },
        reset: function () {
            meals.length = 0;
            totals = {
                mealCount: 0,
                tipTotal: 0,
                tipAvg: 0
            };
        }
    };
});

app.controller('detailsController', function ($scope, mealDataService, $timeout) {
    /*$scope.data = {
        subtotal: 0,
        tipAmt: 0,
        total: 0
    };*/

    $scope.mealCount = 0;

    /*CLEARS FORM FOR NEXT MEAL*/
    $scope.cancelForm = function () {
        $scope.data.price = 0;
        $scope.data.tax = 0;
        $scope.data.tip = 0;
        //alert('cancel');
    };

    /*ADDS THE MEAL WHEN 'ADD MEAL' IS CLICKED*/
    $scope.submit = function () {

        $scope.mealCount++;

        var price = parseFloat($scope.price);
        var tax = parseFloat($scope.tax);
        var tip = parseFloat($scope.tip);

        //COLLECTING DATA FROM CURRENT MEAL PRIOR TO SENDING TO SERVICE ARRAY//
        $scope.data.subtotal = ($scope.data.price + ($scope.data.price * ($scope.data.tax / 100)));
        $scope.data.tipAmt = ($scope.data.price * ($scope.data.tip / 100));
        $scope.data.total = ($scope.data.subtotal + $scope.data.tipAmt);

        /*SENDING CURRENT MEAL TO ARRAY OF MEALS IN SERVICE*/
        var meal = {
            subtotal: $scope.data.subtotal,
            tipAmt: $scope.data.tipAmt,
            total: $scope.data.total
        };
        mealDataService.addMeal(meal);

        //Clears fields for next meal input
        $scope.cancelForm();
    };

    //Animate message
    $scope.show = false;
    $scope.addMessage = function () {
        $scope.show = true;
        $timeout(function () {
            hideMsg();
        }, 2000)
    }

    function hideMsg() {
        $scope.show = false;
    }
});


//Charge Overview Section

app.controller('chargesController', function ($scope, mealDataService) {
    /*$scope.data = {
        subtotal: 0,
        tipAmt: 0,
        total: 0
    };*/

    $scope.getMeals = function () {
        var meals = mealDataService.getMeals();
        $scope.meals = meals;
    };
    $scope.getMeals();
    $scope.mealCount = $scope.meals.length;

    /*-BACK BUTTON FUNCTIONALITY ON CLICK - navigates all meals added-*/
    $scope.back = function () {
        console.log($scope.mealCount);
        if ($scope.mealCount > 1) {
            $scope.mealCount--;
        }
    };

    /*-FORWARD BUTTON FUNCTIONALITY ON CLICK - navigates all meals added-*/
    $scope.forward = function () {
        console.log($scope.mealCount);
        if ($scope.mealCount < $scope.meals.length) {
            $scope.mealCount++;
        }
    };
});

// Update Earnings Section
app.controller('earningsController', function ($scope, mealDataService) {

    $scope.getTotals = function () {

        var tipTotal = mealDataService.getTotals().tipTotal;
        //console.log(mealDataService);
        var mealCount = mealDataService.getTotals().mealCount;
        var tipAvg = mealDataService.getTotals().tipAvg;
        $scope.tipTotal = tipTotal;
        $scope.mealCount = mealCount;
        $scope.tipAvg = tipAvg;
    }
    $scope.getTotals();

});

//RESET SECTION
app.controller('resetCtrl', function ($scope, mealDataService) {
    //WHEN CLICK RESET BUTTON//
    $scope.reset = function () {
        //mealDataService.reset();
        location.reload();
    };
});
