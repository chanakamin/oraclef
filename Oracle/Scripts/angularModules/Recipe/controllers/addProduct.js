(function () {
    function ctrl($scope, ProductsFactory, DetailsFactory) {
        // text will be shown in the view
        $scope.text = {
            title: "new product",
            name: "nutritional",
            value: "value",
            amount: "Weight of one mililiter of this product: "
        };
        // nutritional values from details factory
        var mustNutrition = DetailsFactory.nutritionalsValues();
        var nutritions = [];
        // prepare list of nutritionals values to be nutritionals of product
        angular.forEach(mustNutrition, function (value, key) {
            nutritions[key] = {
                idNutritional: value.id,
                name: value.name,
                amount: 0.0,
                measurement: DetailsFactory.getMeasurement(value.measurements_id)
            };
            if (!angular.isObject(mustNutrition[key].measurement)) {
                nutritions[key].measurement = "";
            }
            else
                nutritions[key].alias = mustNutrition[key].measurement.alias;
        });
        $scope.mustNutrition = nutritions;
        $scope.measureTypes = DetailsFactory.measureTypes().filter(function (m) {
            return m.id == 1 || m.id == 2 || m.id == 6;
        });
        // prepare product object to be added 
        function createProduct() {
            return {
                name: "",
                description: "",
                weight_in_volume: "",
                mustNutrition: nutritions,
                nutritional_per: 0,
            };
        }
        var p = $scope.product = createProduct();

        // onSubmit function
        $scope.SubmitProduct = function () {
            var nutritionalsValues = [];
            angular.forEach(p.mustNutrition, function (value) {
                nutritionalsValues.push({
                    idNutritional: value.idNutritional,
                    amount: value.amount
                });
            });
            var pr = p;
            pr.mustNutrition = null;
            $scope.show = false;
            ProductsFactory.addProduct(pr, nutritionalsValues);
            $scope.product = p = createProduct();
        };
    }
    // Controller for add product
    angular.module("controllers").controller('addProductCtrl', ['$scope', 'ProductsFactory', 'DetailsFactory',ctrl]);
})();

