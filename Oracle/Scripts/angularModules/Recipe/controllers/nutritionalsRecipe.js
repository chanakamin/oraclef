(function () {
    var ctrl = function ($scope,convert) {
        $scope.nutritional = convert.calcNutrition($scope.products);
        $scope.nutritional.forEach(function (n) {
            n.value /= $scope.portions;
        });
    };
    angular.module('controllers').controller('nutritionalRecipeCtrl', ['$scope', 'convertFactory', ctrl]);
})();