/// <reference path="../../../plugin/own.js" />
(function () {
    function ctrl($scope, RecipesFactory, ProductsFactory) {
        if ($scope.$parent.title !== 'new')
            $scope.$parent.link('new');
        $scope.text = {
            title: 'new Recipe'
        };
        $scope.categories = RecipesFactory.getCategories();
        $scope.existsProducts = ProductsFactory.getProducts();
        var r = $scope.recipe = {
            name: "",
            instructions: "",
            description: "",
            portions: "",
            preparation: "",
            tips: "",
            products: new Array(),
            equipments: [],
            category1: {},
        };
        $scope.texts = {
            recipe: {
                name: 'Title',
                description: 'Description',
                preparation: 'Preparation',
                portions: 'Serving',
                equipment: 'Add Special Equipment',
                instructions: 'Instructions',
                tips: 'Do you have some tips for us?'
            }
        };
        var shown = false;
        $scope.AddProduct = function () {
            if (angular.isObject(event))
                event.preventDefault();            
            $scope.showProduct = shown = !shown;
        }
        $scope.showProduct = false;
        $scope.nonEmpty = function (sp) {
            return sp.equipment !== "";
        }
        $scope.addEquipment = function () {
            r.equipments.push({ equipment: $scope.newEquipment });
            $scope.newEquipment = '';
        }

        $scope.isValid = function(recipe) {
            return r.products.length > 0 && !!recipe.category.$viewValue ;
        }
        function isRecipeP(recipe) {
            return recipe.$error.required && recipe.$error.required.length == 1 &&  recipe.$error.required[0].$name === 'recipe_product';
        }
        $scope.SubmitRecipe = function () {            
            if(angular.isObject(event))
                event.preventDefault();
            $scope.addRecipe.$setSubmitted();
            if (($scope.addRecipe.$invalid && !isRecipeP($scope.addRecipe))  || !$scope.isValid($scope.addRecipe)) {
                //$scope.addRecipe.$setSubmitted();
                return;
            }
           // if ($scope.addRecipe.$valid) {
                angular.forEach(r.equipments, function (val, key) {
                    r.equipments[key] = {
                        special_equipment: val.equipment
                    };
                });
                r.products_in_recipe = r.products;
                r.products = null;
                r.category = r.category1.id;
                debugger;
                RecipesFactory.addRecipe(r);
         //   }
           // $scope.addRecipe.$setSubmitted();
        }
        $scope.$parent.child = $scope;
        $scope.error = {
            required: sentences.required,
            select: sentences.select,
            product_recipe: sentences.product_recipe,
        }
       }
    angular.module("controllers").controller("newRecipeCtrl", ['$scope', 'RecipesFactory', 'ProductsFactory', ctrl]);
})();
