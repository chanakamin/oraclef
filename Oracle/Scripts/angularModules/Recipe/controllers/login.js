(function () {    
    'use strict'    
    function ctrl($scope, userFactory) {
        //$(document).ready(function () {
        //    $("#welcomeMenu").mmenu({
        //        extensions: ["theme-dark", "border-full", "multiline", "pagedim-white"],
        //        offCanvas: {
        //            position: "right",
        //            zposition: "front"
        //        }
        //    });
        //});
        var parent = $scope.$parent;
        // $scope.menuItems = uiFactory.menuItems(1); debugger;
        var states = ['welcome', 'sign', 'login', 'guest', 'message'];
        $scope.part = states[0]; 
        function state(stat) {
            if (angular.isObject(event)) {
                event.preventDefault();
            }
            if (angular.isNumber(stat))
                $scope.part = states[stat];
            else
                $scope.part = stat;
            if ($scope.part === states[3]) {
                $scope.enter();
            }
        }
        parent.state = state;
        var user =  $scope.user = {};
        $scope.help = {};
        $scope.message = { type: '' };
        var ajaxResult = function(success){
            if (success == true)
                parent.changePart(1);
            else {
                user = {};
                if (success !== 'manager') {
                    $scope.help.message = success;
                    $scope.part = states[4];
                    $scope.message.type = "help";
                }
                else {
                    $scope.part = states[4];
                    $scope.message.type = "manager";
                }
               
            }
        }

        $scope.register = function () {
            user = $scope.user;
            userFactory.addUser(user.name, user.password, user.email)
                .then(function (success) {                   
                       ajaxResult(success)                    
                });
        }
        $scope.loginUser = function () {
            user = $scope.user;
            userFactory.login(user.name, user.password)
                .then(function (success) {
                    ajaxResult(success);
                });
        }
        var enter = false;
        $scope.enter = function () {
            if (!enter) {
                $scope.part = states[4];
                $scope.message.type = "enter";
                enter = !enter;
            }
            else {
                userFactory.guest();
                parent.changePart(1);
            }
        }
        $scope.try = function () {
            parent.changePart(1);
        }
    };
    angular.module('controllers').controller('loginCtrl', ['$scope', 'userFactory', ctrl]);
})();