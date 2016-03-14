(function () {
    function ctrl($scope, mf,RecipesFactory) {
        $scope.recipe = mf.get('edit');
        $scope.save = function () {
            RecipesFactory.update($scope.recipe).then(function () {
                alert('update');
            });
        };
    };
        angular.module('controllers').controller('editrecCtrl', ['$scope', 'managerFactory','RecipesFactory', ctrl]);
    function ctrl1($scope, mf) { };
    angular.module('controllers').controller('editprodCtrl', ['$scope', 'managerFactory', ctrl1]);
})();