(function () {
    angular.module('factoryModule').factory('constantFactory', function () {

        return {
            measurement_id: {
                tools: 11,
                gram: 1,
                mililiter: 2
            },
            measure_type_id: {
                weight: 1,
                volume: 2,
                tools: 3,
            },
            words: {
            },
        }
    });
})();