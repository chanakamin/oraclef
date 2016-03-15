(function () {
    function ctrl($scope, RecipesFactory, userFactory) {
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
        var originalProducts = r.products.getCopy();
    }
    angular.module('controllers').controller('showRecipeCtrl', ['$scope', 'RecipesFactory','userFactory', ctrl]);

    function ctrl1($scope, ProductsFactory) {
        var p = ProductsFactory.getCurrentProduct();
        ProductsFactory.setObjects(p);
        $scope.product = p;
    }
    angular.module('controllers').controller('showProductCtrl', ['$scope', 'ProductsFactory', ctrl1]);
})();

