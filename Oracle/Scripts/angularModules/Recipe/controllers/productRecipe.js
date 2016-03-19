/// <reference path="../../../plugin/own.js" />
(function () {
    function ctrl($scope, ProductsFactory, DetailsFactory) {
        $scope.Products = ProductsFactory.getProducts();
        $scope.Measurements = DetailsFactory.measurements();
        $scope.add = $scope.productRecipe ? false : true;
        var products = $scope.recipeProducts;
        function deleteProduct() {            
            products.splice(products.indexOf($scope.productRecipe), 1);
        }
        var isValid = function (productr) {
            return productr.measurement.$viewValue > 0 && productr.ingrediant.$viewValue > 0;
        }
        function addProductRecipe() {
            $scope.recipe_product.$setSubmitted();
            if ($scope.recipe_product.$invalid || !isValid($scope.recipe_product))
                return;
            products.push($scope.productRecipe);
            $scope.productRecipe = {};
            $scope.recipe_product.$submitted = false;
            $scope.recipe_product.$setValidity('required', true, 'productRecipeCtrl');
        };
        $scope.submit = $scope.add ? addProductRecipe : deleteProduct;
        $scope.error = {
            required: sentences.required,
            select: sentences.select,
        }        
    }
    angular.module('controllers').controller('productRecipeCtrl', ['$scope', 'ProductsFactory', 'DetailsFactory',ctrl]);
})();