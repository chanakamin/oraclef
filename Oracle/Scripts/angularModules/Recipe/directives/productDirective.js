angular.module("directives")
    .directive('newProduct', function () {
    return {
        restrict: 'EA',
        scope:{
            show: "="
        },
        templateUrl: 'Recipe/addProduct',
        controller:'addProductCtrl'
    };
});