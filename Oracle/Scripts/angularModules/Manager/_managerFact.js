(function () {
    function fact() {
        var data = {};
        return {
            set: function (key, val) {
                data[key] = val;
            },
            get: function (key) {
                return data[key];
            },
        };
    }
    angular.module('factoryModule').factory('managerFactory', [fact]);
}());