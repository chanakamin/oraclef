(function () {
    function fact() {
        function Item(action, text,clas,part) {
            this.action = action;
            this.text = text;
            this.clas = clas;
            this.part = part;
        }
        var menuItems = [
            new Item("state('login')", "Login", "glyphicon-user", 1),
            new Item("state('sign')", "Sign In", "glyphicon-log-in", 1),
            new Item("state('guest')", "Enter", "", 1),
            new Item("link('newRecipe')", "New Recipe", "glyphicon-pencil", 2),
            new Item("link('allRecipes')", "Recipes List", "glyphicon-th-list", 2),
        ];
       
        return {
            menuItems: function (part) {
                return menuItems.filter(function (i) {
                    return i.part === part;
                });
            },
            newMenuItems: function (newList) {
                menuItems = newList;
            },
            addMenuItem: function (item) {
                menuItems.push(item);
            },
            removeMenuItem: function (item) {
                
            },
        };
    };
    angular.module('factoryModule').factory('uiFactory',[fact]);
})();