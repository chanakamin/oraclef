(function () {
    var dir = function () {
        var ddo = {
            restrict: 'E',
            scope: {
                searchResult: '=',
            },
            templateUrl: 'Recipe/search',
            controller: 'searchCtrl',
        };
        return ddo;
    };
    angular.module('directives').directive('searchRecipe', dir);
    var dircalc = function () {
        var ddo = {
            restrict: 'E',
            scope: {
                products: '=',
            },
            templateUrl: 'Recipe/calculator',
            controller: 'calculatorCtrl',
        }
        return ddo;
    };
    angular.module('directives').directive('calculator', dircalc);
})();