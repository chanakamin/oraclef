(function () {
    function fact() {
        function User(id,name, manager) {
            this.name = name;
            this.id = id;
            this.user_or_manager = manager || false;
        }
        var user = new User();
        return {
            getUser: function () {
                return user;
            },
            setUser: function (u) {
                if(u == null)
                    window.location.href = '/';
                else  if (u == 'guest')
                    this.guest();
                else {
                    user = new User(u.id, u.name, u.user_or_manager);
                    user.password = u.password;
                    user.email = u.email;
                }
            },
            guest: function () {
                user = new User(0,'guest');
            },
            isManager: function()
            {
                return user.user_or_manager;
            },
        };
    }
    angular.module('factoryModule').factory('userFactory',['resourcesFactory','$location',fact]);
})();