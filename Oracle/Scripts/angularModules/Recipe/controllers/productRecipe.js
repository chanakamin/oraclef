(function () {
    function ctrl($scope, ProductsFactory, DetailsFactory) {
        $scope.Products = ProductsFactory.getProducts();
        $scope.Measurements = DetailsFactory.measurements();
        $scope.add = $scope.productRecipe ? false : true;
        var products = $scope.recipeProducts;
        function deleteProduct() {            
            products.splice(products.indexOf($scope.productRecipe), 1);
        }
        function addProductRecipe() {
            products.push($scope.productRecipe);
            $scope.productRecipe = {};
        };
        $scope.submit = $scope.add ? addProductRecipe : deleteProduct;
       
    }
    angular.module('controllers').controller('productRecipeCtrl', ['$scope', 'ProductsFactory', 'DetailsFactory',ctrl]);
})();