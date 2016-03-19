/// <reference path="../factories/recipeFactory.js" />
(function () {
    function ctrl($scope, $location, $route, RecipesFactory) {
        function Recipe(r) {
            this.id = r.id;
            this.name = r.name;
            this.description = r.description;
            this.category = r.category || r.category1.id;
        }
        Recipe.prototype.show = function () {
            if (angular.isObject(event))
                event.preventDefault();
            $location.path('/recipe/' + this.id);
            $scope.$parent.part = 'show';
            $scope.$parent.title = 'Show Recipe',
            RecipesFactory.setCurrent(this.id);
        };
        var recipeslist = (function(){
            if ($route.current.locals.like == true)
                return RecipesFactory.getLiked().getCopy();
            else
                return RecipesFactory.getRecipes().getCopy();
        })();
        // recipes - object contains functions related to recipes display.
        var recipes = {
            // list of all recipes
            all: recipeslist,
            // orginized list of recipe
            orginzed: (function (list) {
                var arr = [];
                angular.forEach(list, function (r) {
                    arr.push(new Recipe(r));
                });
                return arr;
            })(recipeslist),
            // get list of categories
            categories: RecipesFactory.getCategories().getCopy(),
            // change cuurent category to show
            change: function () {
                if (recipes.cat.id === 0)
                    this.shown = this.orginzedCat;
                else {
                    this.shown = this.orginzedCat.filter(function (c) {
                        return c.category.id === recipes.cat.id;
                    })
                }
            }
        };
        // change category upon category obj
        recipes.changeC = function (cat) {
            if (angular.isObject(cat))
                recipes.cat = cat;
            recipes.change();
        }
        // list of recipes, orginized by categories
        recipes.orginzedCat = recipes.shown = RecipesFactory.orginizedByCategories(recipes.orginzed);
        // current categort to show
        recipes.cat = { id: 0, name: 'all' };
        // recipes to show
        recipes.search = recipes.all;
        recipes.categories.unshift(recipes.cat);
        $scope.recipes = recipes;
        $scope.$on('search_ended', function () {
            recipes.shown = recipes.search;
        });
    }
    angular.module('controllers').controller('recipesListCtrl', ['$scope', '$location', '$route', 'RecipesFactory', ctrl]);

    function ctrl2($scope, RecipesFactory, userFactory) {

    }
    angular.module('controllers').controller('favoriteCtrl',['$scope','RecipesFactory','userFactory',ctrl2])
})();