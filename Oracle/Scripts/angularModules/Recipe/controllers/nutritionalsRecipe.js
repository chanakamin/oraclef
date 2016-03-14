(function () {
    var ctrl = function ($scope,convert) {
        $scope.nutritional = convert.calcNutrition($scope.products);
    };
    angular.module('controllers').controller('nutritionalRecipeCtrl', ['$scope', 'convertFactory', ctrl]);
})();