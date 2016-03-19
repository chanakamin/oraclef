(function () {
    function fact($http, $location) {
        // user constractor
        function User(name, password, email, manager) {
            this.name = name;
            this.password = password;
            this.email = email;
            this.user_or_manager = manager | false;
        }
        var user = new User();
        // check if this user already exists
        User.prototype.verify = function () {
           return  $http({
                method: 'post',
                data: { name: this.name, password: this.password, email: this.email },
                url: "Login/existUser",
            }).then(function (data) {
                return data.data;
            })
        }
        // add user to db.
        User.prototype.add = function () {
            return $http({
                method: 'post',
                data: {
                    user: this,
                    model: {
                        UserName: this.name,
                        Password: this.password,
                        ConfirmPassword: this.password
                    }
                },
                url: "Login/addUser",
            }).then(function (data) {
                var data = data.data;
                if (data.status === 200) {
                    this.id = data.data.id;
                    return true;
                }
                return data.reason;
            });            
        };
        // login
        User.prototype.register = function () {
            return $http({
                method: 'post',
                data: {
                    user: this,
                    model: {
                        UserName: this.name,
                        Password: this.password,
                        RememberMe: false
                    }
                },
                url: "Login/register",
            }).then(function (data) {
                data = data.data;
                if (data.status === 200) {
                    user = this;
                    return true;
                }
                return data.reason;
            });
        }
        // logout
        User.prototype.unregister = function () {
            return $http({
                method: 'get',
                url: 'Login/logout',
                data: {id: this.id}
            }).then(function () {
                if (user == this)
                    user = {};
            });
        }
        return {
            getUser: function () {
                return user;
            },
            addUser: function (name, password, email, navigate) {
                var u = new User(name, password, email);
                return u.verify().then(function (data) {
                    if (data.data.can) {
                        user = u;
                        return user.add();
                     }
                    else {
                        return data.reason;
                    }
                });
            },
            addManager: function (name, password, email) {

            },
            login: function (name, password) {
                u = new User(name, password);
                return u.verify().then(function (data) {
                    if (data.data.exist) {
                        var user = data.data.user;
                        u.email = user.email;
                        u.user_or_manager = user.user_or_manager;
                        u.id = user.id;
                        u.register();
                        if (!u.user_or_manager)
                            return true;
                        else {
                            return 'manager';
                        }
                    }
                    else {
                        return data.reason;
                    }
                });
            },
            logout: function () {
                return user.unregister();
            },
            guest: function () {
                user = { id: 0, name: 'guest' };
            },
            signin: function (name, password, email) {
                return this.addUser(name, password, email).then(function (data) {
                    if(data == true)
                        return user.register();
                    return data;
                });
            },

        };
    }
    angular.module('LoginApp').factory('userFactory', ['$http', '$location', fact]);
})();