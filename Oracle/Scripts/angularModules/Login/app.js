var app = angular.module('LoginApp', ['ngRoute']);
app.config(function( $locationProvider,$routeProvider)
{
    'use strict'
    $routeProvider
    .when('/', {
        templateUrl: 'Login/Welcome'
    }).when('/signin', {
        templateUrl: 'Login/SignIn'
    }).when('/signup', {
        templateUrl: 'Login/Signup'
    }).when('/logout', {
        templateUrl: 'Login/Logout'
    }).otherwise({
        redirectTo: '/',
    });

});
app.run(function ($location, $rootScope, $http, $rootScope) {
    $http.get('Login/user').then(function (data) {
        var d = data.data; 
        if (d.status == 200)
        {
            if (d.data.user.user_or_manager) {
                $rootScope.$broadcast('manager_login');
            }
            else {
                window.location.href = '/Recipe';
            }
        }
    });
    $rootScope.history = [];
    $rootScope.$on('$routeChangeSuccess', function (event, routeData) {
        $rootScope.history.push($location.$$path);
    });
});
app.directive('signIn', function () {
    return {
        restrict: 'EA',
        templateUrl: 'Login/SignIn'
        }
    }
);
app.directive('signUp', function () {
    return {
        restrict: 'EA',
        templateUrl: 'Login/Signup'
    }
}
);