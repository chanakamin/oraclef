(function () {
    // controller for index page
    function ctrl($scope, $location, $rootScope, uf) {
        $scope.part = $scope.title = 'welcome';
        $scope.$on('init', function () {
            $scope.user = uf.getUser();
           // $scope.user.name = $scope.user.name.camelize();
        });
        $scope.link = function (page,hash) {
            if (angular.isObject(event))
                event.preventDefault();
            $location.path(page);
            if (!hash)
                hash = '';
                $location.hash(hash);
                $scope.title = $scope.words[page];
                $scope.part = page;
        };
        $scope.logout = function () {
            if (angular.isObject(event))
                event.preventDefault();
            //window.location.search = 'view=true';
            window.location.href = 'Login/Logout?view=true';
        }
        $scope.changePart = function (part) {  
        }
        $scope.words = {
            logout: 'Log Out',
            newres: 'New Recipe',
            reslist: 'Recipes List',
            recipes: 'Recipes',
            'new': 'New Recipe',
            approve: 'Approve',
            search: 'Search',
            favorite: 'Liked Recipes',
            like: 'Like it',
        };
    }
    angular.module("controllers").controller("indexCtrl", ['$scope', '$location', '$rootScope', 'userFactory', ctrl]);
})();

