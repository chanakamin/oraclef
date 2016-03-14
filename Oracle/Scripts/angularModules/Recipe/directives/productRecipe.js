(function () {
    angular.module("directives")
    .directive('addproductRecipe', function () {
        return {
            restrict: 'EA',
            templateUrl: 'Recipe/addRecipeForProduct',
            controller: 'productRecipeCtrl',
            scope: {
                recipeProducts: "="
            }
        };
    });
    angular.module("directives")
    .directive('exproductRecipe', function () {
        return {
            restrict: 'EA',
            templateUrl: 'Recipe/addRecipeForProduct',
            controller: 'productRecipeCtrl',
            scope: {
                productRecipe: "=product",
                recipeProducts: "=products"
            }
        };
    });
})();