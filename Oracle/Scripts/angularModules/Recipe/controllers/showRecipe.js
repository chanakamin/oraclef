(function () {
    function ctrl($scope, RecipesFactory, userFactory, DetailsFactory, convertfFilter) {
        if ($scope.$parent.part !== 'show') {
            $scope.$parent.part = 'show';
            $scope.$parent.title = 'Show Recipe';
        }
        var r = RecipesFactory.getCurrentRecipe();
        RecipesFactory.setObjects(r);
        $scope.recipe = r;

        var like = $scope.like = {
            active: userFactory.getUser().id !== 0,
            user: userFactory.isLike(r.id),
            msg: ' people like this recipe.',
            convince: 'Do you like this recipe? Share us!',
            userlike: 'This is one of the recipes you liked',
            setLike: function () {
                userFactory.addFavorite(r.id).then(function (data) {
                    if (data) {
                        $scope.like.user = true;
                        r.favorites++;
                    }
                })
            }
        }
        //var originalProducts = r.products.getCopy();
        $scope.config = DetailsFactory.defaultConvertObject();
        $scope.config.portions = r.portions;
        $scope.products = r.products.getCopy();
        $scope.convert = function () {
            $scope.products = convertfFilter(r.products, $scope.config);
        }
        $scope.products = convertfFilter($scope.products, $scope.config);
        //angular.element("#calculatorMenu").mmenu({
        //    extensions: ["theme-dark", "border-full", "multiline", "pagedim-white"],
        //    offCanvas: {
        //        position: "right",
        //        zposition: "front"
        //    }
        //});
    }
    angular.module('controllers').controller('showRecipeCtrl', ['$scope', 'RecipesFactory','userFactory', 'DetailsFactory','convertfFilter',ctrl]);

    function ctrl1($scope, ProductsFactory) {
        var p = ProductsFactory.getCurrentProduct();
        ProductsFactory.setObjects(p);
        $scope.product = p;
    }
    angular.module('controllers').controller('showProductCtrl', ['$scope', 'ProductsFactory', ctrl1]);
})();

