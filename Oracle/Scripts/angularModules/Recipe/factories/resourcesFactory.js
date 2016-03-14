(function () {
    // factory for all ajax requests
    var factory = angular.module("factoryModule");
    factory.factory("resourcesFactory", function ($http) {
        var resources = {};
        var init = function () {
            $http.get("Data/getLists").then();
        };
        return {
            initResources: function () {
                return $http.get("Data/getLists").then(function (data) {
                    resources = data.data;
                    console.log(resources);
                    return;
                });
            },
            initResource: function (action, resource) {
                return $http.get("Data/" + action).then(function (data) {
                    console.log(data);
                    resources[resource] = data;
                    return data;
                });
            },
            getResource: function (resource) {
                return resources[resource];
            },
            addResource: function (action, config) {
                return $http.post("Data/" + action, config)
                    .then(function (data) {
                        return data;
                    });
            },
            updateResource: function (action, data) {
                return $http.put("Data/" + action, data)
                    .then(function (data) {
                        return data.data;
                    });
            },
            getData: function (action) {
                return $http.get('Data/' + action).then(function (data) {
                    return data.data;
                });
            },
            action: function (config) {
                return $http(config).then(function (response) {
                    return response.data;
                });
            }
        };
    });
})();