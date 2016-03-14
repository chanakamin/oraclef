(function () {
    var dir = function () {
        var ddo = {
            restrict: 'E',
            scope: {
                products: "=",
            },
            templateUrl: 'Recipe/nutritionalValues',
            controller: 'nutritionalRecipeCtrl',
        };
        return ddo;
    };
    angular.module('directives').directive('nutritionalValues', dir);
})();