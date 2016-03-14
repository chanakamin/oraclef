/**
 * Created by Geller on 09 נובמבר 2015.
 */

angular.module("factoryModule", []).run(function (DetailsFactory, RecipesFactory, ProductsFactory) {
    console.log('run');
    angular.module('factoryModule').factories = {
        details: DetailsFactory,
        products: ProductsFactory,
        recipes: RecipesFactory
    }    
});
