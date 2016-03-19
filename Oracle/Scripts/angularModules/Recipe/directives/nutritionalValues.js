(function () {
    var dir = function () {
        var ddo = {
            restrict: 'E',
            scope: {
                products: "=",
                portions: '=',
            },
            templateUrl: 'Recipe/nutritionalValues',
            controller: 'nutritionalRecipeCtrl',
        };
        return ddo;
    };
    angular.module('directives').directive('nutritionalValues', dir);
})();