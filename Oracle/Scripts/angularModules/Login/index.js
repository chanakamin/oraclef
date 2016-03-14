(function () {
    function ctrl($scope, $locatoin,$timeout,$http, userFactory) {
        function direct(part) {
            window.location.href = '/'+part;
        }
        $scope.direct = direct;
        function init(oper,message) {
            $scope.user = {};
            $scope.oper = true;
            $scope.operation = messages.getMessage(oper).context;
            $scope.message = messages.getMessage(message).context;

        };
        var parts = {
            signup: function () {
                init('signoper', 'useroperation');
            },
            signin: function () {
                init('logoper', 'asksign');
            },
            '/': function () {
            }, guest: function () {
                $scope.message = messages.getMessage('guestopt').context;
                $scope.operation = messages.getMessage('guest').context;
                $scope.guestPart = true;
                $timeout(function () { $scope.guestPart = false; }, 5000);
            }
        };
        parts.restart = function () {
            var dest = $locatoin.path().slice(1);
            if (dest === "")
                dest = '/';
            var f = parts[dest] || parts['/'];
            f();
            $scope.title = $scope.words[dest];
        }
        var part = $locatoin.path();
        $scope.link = function (dest) {
            if (angular.isObject(event))
            {
                event.preventDefault();
            }
            $locatoin.path(dest);
            parts.restart();
        };
        function Message(header, context) {
            this.header = header;
            this.context = context;
        }
        var messages = [
            new Message('guest', 'Are you sure you want to login as a guest?'),
            new Message('manager', 'Are you want to login as a user or as a manager?'),
            new Message('innorrect', 'The Name and password you entered is not correct.'),
            new Message('tryagain', 'Did you want to try again?'),
            new Message('guestopt', 'If you continue as a guest you will not be able to upload your own recipes.'),
            new Message('useroperation', 'Once you are registered you will be able to design your own recipes and upload them'),
            new Message('signoper', 'Enter your name and a password to sign in'),
            new Message('logoper', ' Enter your name and password to log in'),
            new Message('asksign', 'If you are not registered, please sign in'),
        ];
        messages.getMessage = function (header) {
            return messages.filter(function (m) {
                return m.header === header;
            })[0];
        }
        $scope.words = {
            ok: 'OK',
            cancel: 'Cancel',
            signup: 'Sign Up',
            signin: 'Sign In',
            login: 'Login',
            '/': 'Welcome',
            welcome: 'Welcome',
            logout: 'Log out',
            enter: 'Enter',
            guest: 'Continue as guest',
            user: 'User',
            manager: 'Manager',
        };
        $scope.user = userFactory.getUser();
        $scope.signup = function () {
            user = $scope.user;
            userFactory.signin(user.name, user.password, user.email)
                .then(function (success) {
                    if (success == true)
                        direct('Recipe');
                    else {
                        $scope.oper = false;
                        $scope.message = success;
                    }
                });
        };
        $scope.Login = function () {
            user = $scope.user;
            userFactory.login(user.name, user.password)
                .then(function (success) {
                    if (success == true)
                        direct('Recipe');
                    else {
                        $scope.oper = false;
                        $scope.error = true;
                        if (success == 'manager') {
                            $scope.message = messages.getMessage('manager');
                            $scope.error = false;
                        } else {
                            $scope.message = success;
                        }
                    }
            });
        }
        $scope.guest = function () {
            $http.post('Login/guest').then(function () {
                direct('Recipe');
            });            
        }
        $scope.$on('manager_login', function () {
            $locatoin.path('signin');
            $scope.oper = false;
            $scope.message = messages.getMessage('manager');
            $scope.error = false;
            $scope.apply();
        })
        parts.restart();
    }
    angular.module('LoginApp').controller('loginCtrl', ['$scope','$location','$timeout','$http','userFactory',ctrl]);
})();