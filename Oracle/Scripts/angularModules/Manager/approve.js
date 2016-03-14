(function () {
    function ctrl($scope, $location, productFactory, recipeFactory, userFactory, mf) {
        var p = $location.hash();
        var fact;
        mf.set('approvelist', p);
        if (p == 'products')
            fact  = productFactory;
            /// $scope.approve = productFactory.notApproved();
        else
            fact = recipeFactory;
        //$scope.approve = recipeFactory.notApproved();
        $scope.approve = fact.notApproved();
        $scope.aprove = function (id) {
            var f;
            if (p == 'products')
                f = productFactory.approve;
            else
                f = recipeFactory.approve;
            f(id,true).then(function (data) {
                $scope.approve = fact.notApproved();//data;
                $scope.$emit('notapproved');
               // alert('approve');
            });
        }
        $scope.delete = function (id) {
            var f;
            if (p == 'products')
                f = productFactory.approve;
            else
                f = recipeFactory.approve;
            f(id, false).then(function (data) {
                $scope.approve = fact.notApproved();
                //alert('deleted');
            });
        }
       
    }
    angular.module('controllers').controller('approveCtrl', ['$scope','$location', 'ProductsFactory', 'RecipesFactory', 'userFactory','managerFactory', ctrl]);
})();