/// <reference path="../../../plugin/own.js" />
(function () {
    function ctrl($scope,$timeout, rf, pf) {
        var products = pf.getProducts().getCopy();;
        $scope.prod = {
            remain: products,
            not: [],
            con: [],
            add: function(id, con_not){
                var index = -1;
                $scope.prod.remain.every(function(r){
                    index += 1;
                    return r.id !== id;
                });                
                var add = con_not ? $scope.prod.con : $scope.prod.not;
                add.push($scope.prod.remain[index]);
                $scope.prod.remain.splice(index,1);
            },
            remove: function(id, con_not){
                var add = con_not ? $scope.prod.con : $scope.prod.not;
                var index = -1;
                add.every(function (r) {
                    index += 1;
                    return r.id !== id;
                });
                $scope.prod.remain.push(add[index]);
                add.splice(index, 1);
            },
        }; 
        $scope.categories = {
            declude: rf.getCategories().getCopy(),
            include: [],
            add: function () {
                var index = -1;
                $scope.categories.declude.every(function (c) {
                    index++;
                    return c.id !== $scope.cat.id;
                });
                var rm = $scope.categories.declude.splice(index, 1);
                $scope.categories.include.push(rm[0]);               
            },
            remove: function (c) {
                var index = -1;
                $scope.categories.include.every(function (ca) {
                    index++;
                    return ca.id !== c.id;
                });
                var rm = $scope.categories.include.splice(index, 1);
                $scope.categories.declude.push(rm[0]
                    );
            }
        };
        $scope.cal = { min: 0, max: 0 };
        $scope.search = function () {
            var count, res = [],ob = [];
            // init list of recipes
            var recipes = rf.getRecipes().getCopy();
            // cariterias
            // 1. calories:
            // check if calories specific
            if ($scope.cal.min >= 0 && $scope.cal.min < $scope.cal.max)
                recipes = rf.recipesBetweenCalories(recipes, $scope.cal.min, $scope.cal.max);
            // 2. recipes doesn't contain products
            recipes.forEach(function (r, i) {
                $scope.prod.not.forEach(function (p) {
                    if (rf.recipeHasProduct(r, p.id))
                        recipes.splice(i, 1);
                });
            });
            if ($scope.prod.con.length > 0) {
                // recipes that contains products, order by amount
                recipes.forEach(function (r) {
                    count = rf.recipeHasProducts(r, $scope.prod.con);
                    r.amountProd = count;
                });
                recipes.sort(function (r1, r2) {
                    return -r1.amountProd + r2.amountProd;
                });
                recipes = recipes.filter(function (r) {
                    return r.amountProd > 0;
                });
            }
            res = rf.orginizedByCategories(recipes,1);
            // orginized recipes by categories
            if ($scope.categories.include.length > 0) {
                var cats = $scope.categories.include;                
                cats.forEach(function (c) {
                    ob.push(res[c.id]);
                });
                res = ob;
            }
            recipes = res.filter(function (r) {
                return typeof r !== 'undefined';
            });
            $scope.searchResult = recipes;
            $timeout(function () {
                $scope.$emit('search_ended');
            }, 0);
        };
    };
    angular.module('controllers').controller('searchCtrl', ['$scope','$timeout', 'RecipesFactory','ProductsFactory', ctrl]);
})();