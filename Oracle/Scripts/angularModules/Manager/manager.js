(function () {
    function ctrl($scope, productFactory, recipeFactory, userFactory, $location, mf) {
        function init() {
            $scope.products = { num: productFactory.notApproved().length };
            $scope.recipes = { num: recipeFactory.notApproved().length };
        }
        $scope.$on('init', function () {
            init();
        });
        $scope.$on('notapproved', function () {
            init();
        });
        $scope.nav = function (ap) {
            var approvelist = mf.get('approvelist');
            if (angular.isObject(event))
                event.preventDefault();
            if (approvelist == 'products')
                $location.path('/product/' + ap.id);
            else
                $location.path('/recipe/' + ap.id);
            mf.set('edit',ap);
            $location.hash('');
        }

        // words
        $scope.words = $scope.$parent.words;
        $scope.words.approveproducts = 'Approve Products';
        $scope.words.approverecipes = 'Approve Recipes';
    }
    angular.module('controllers').controller('managerCtrl', ['$scope', 'ProductsFactory', 'RecipesFactory', 'userFactory','$location','managerFactory', ctrl]);
})();