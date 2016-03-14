var app = angular.module('app', ['controllers', 'ngRoute', 'factoryModule']);
app.config(function ($routeProvider, $locationProvider)
{
    'use strict'
    var part = window.location.pathname.slice(1);
    $routeProvider
    .when('/recipes', {
        templateUrl: 'Recipe/allRecipes',
        controller: 'recipesListCtrl'
    }).when('/new', {
        templateUrl: 'Recipe/newRecipe',
        controller: 'newRecipeCtrl'
    }).when('/newproduct', {
        templateUrl: 'Recipe/addProduct',
        controller: 'addProductCtrl'
    }).when('/addRecipeForProduct', {
        templateUrl: 'Recipe/addRecipeForProduct',
        controller: 'productRecipeCtrl'
    }).when('/nutritionalValues', {
        templateUrl: 'Recipe/nutritionalValues',
        controller: 'nutritionalsRecipeCtrl'
    }).when('/recipe/:id', {
        templateUrl: 'Recipe/showRecipe/0',
        controller: 'showRecipeCtrl'
    }).when('/product/:id', {
        templateUrl: 'Recipe/showProduct/0',
        controller: 'showProductCtrl'
    }).when('/', {
        templateUrl: part +'/Welcome',
    }).when('/approveproduct', {
        templateUrl: 'Manager/approved',
        controller: 'approveCtrl',
    }).when('/approverecipes', {
        templateUrl: 'Manager/approved',
        controller: 'approveCtrl',
    }).when('/editrecipe/:id', {
        templateUrl: 'Manager/editRecipe',
        controller: 'editrecCtrl',
    }).when('/editproduct/:id', {
        templateUrl: 'Manager/editProduct',
        controller: 'editprodCtrl',
    }).otherwise({
        redirectTo: '/',
    });
    //$locationProvider.html5Mode(true);
});
// when app runs, all factories are being initialize.
app.run(function ($location, $rootScope, ProductsFactory, DetailsFactory, RecipesFactory, resourcesFactory, userFactory, convertFactory) {
    resourcesFactory.initResources().then(function (data) {
        ProductsFactory.initProducts();
        RecipesFactory.initRecipes();
        DetailsFactory.init();
        userFactory.setUser(DetailsFactory.user());
        $rootScope.$broadcast('init');
        angular.module('factoryModule').value('fact', {
            details: DetailsFactory,
            products: ProductsFactory,
            recipes: RecipesFactory
        });
    }); 
    $rootScope.history = [];
    $rootScope.$on('$routeChangeSuccess', function (event, routeData) {
            $rootScope.history.push($location.$$path);
    });
    convertFactory.init();
});