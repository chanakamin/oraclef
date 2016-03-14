(function () {
    function fact(resourcesFactory) {
        function User(id,name, manager) {
            this.name = name;
            this.id = id;
            this.user_or_manager = manager || false;
            this.favorites = [];
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
                    resourcesFactory.getData('favorite').then(function (data) {
                        user.favorites = data;
                    })
                }
            },
            guest: function () {
                user = new User(0,'guest');
            },
            isManager: function()
            {
                return user.user_or_manager;
            },
            addFavorite: function (recipe) {
                resourcesFactory.addResource('favorite', { recipe: recipe }).then(function (data) {
                    if (data.success) {
                        user.favorites.push(data.id)
                    }
                })
            },
        };
    }
    angular.module('factoryModule').factory('userFactory',['resourcesFactory','$location',fact]);
})();