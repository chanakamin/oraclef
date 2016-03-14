(function () {
    function ctrl($scope, RecipesFactory, ProductsFactory) {        
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
        $scope.SubmitRecipe = function () {            
            if(angular.isObject(event))
                event.preventDefault();
            if ($scope.addRecipe.$invalid) {
                $scope.addRecipe.$setSubmitted();
                return;
            }
            if ($scope.addRecipe.$valid) {
                angular.forEach(r.equipments, function (val, key) {
                    r.equipments[key] = {
                        special_equipment: val.equipment
                    };
                });
                r.products_in_recipe = r.products;
                r.products = null;
                debugger;
                RecipesFactory.addRecipe(r);
            }
           // $scope.addRecipe.$setSubmitted();
        }
        $scope.$parent.child = $scope;
    }
    angular.module("controllers").controller("newRecipeCtrl", ['$scope', 'RecipesFactory', 'ProductsFactory', ctrl]);
})();
