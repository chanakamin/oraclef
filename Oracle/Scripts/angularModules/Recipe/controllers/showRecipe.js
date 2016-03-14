(function () {
    function ctrl($scope, RecipesFactory) {
        var r = RecipesFactory.getCurrentRecipe();
        RecipesFactory.setObjects(r);
        $scope.recipe = r;
        var originalProducts = r.products.getCopy();
    }
    angular.module('controllers').controller('showRecipeCtrl', ['$scope', 'RecipesFactory', ctrl]);

    function ctrl1($scope, ProductsFactory) {
        var p = ProductsFactory.getCurrentProduct();
        ProductsFactory.setObjects(p);
        $scope.product = p;
    }
    angular.module('controllers').controller('showProductCtrl', ['$scope', 'ProductsFactory', ctrl1]);
})();

