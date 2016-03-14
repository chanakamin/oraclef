/// <reference path="../../../plugin/own.js" />
(function () {
    var factory = angular.module("factoryModule").factory("DetailsFactory", function($http, resourcesFactory){
        // arrays of details
        var nutritionals = [],
            measurements = [],
            measureTypes = [],
            user = 0,
            types = [];
        // function to get measurement per id
        function getMeasurement(id)
        {
            var res = -1;
            angular.forEach(measurements, function (value) {
                if (value.id === id)
                    res =  value;
            });
            return res;
        }

        // function to group measurements by types, order by their size
        function groupMeasurements() {
            var types = [];
            var me = measurements.getCopy();
            measureTypes.filter(function (mt) {
                return mt.id <= 3;
            }).forEach(function (mt) {
                types[mt.id] = { measure_type: create(mt), list: [] };
            });
            me.forEach(function (m) {
                if (m.measure_type_id <= 3 && m.measurement_id <= 2)
                    types[m.measure_type_id].list.push(create(m));
            });
            types.forEach(function (t) {
                t.list.sort(function (m1, m2) {
                    return m1.amount > m2.amount;
                });
            });
            return types;
        }
        return {
            // function to init resources from resources factory
            init: function () {
                var that = this;
                var data = resourcesFactory.getResource('details');
                nutritionals = data.nutritionalValues;
                measurements = data.measurements;
                measureTypes = data.measureTypes;
                user = data.user; 
                angular.forEach(nutritionals, function (value) {
                    value.measurement = that.getMeasurement(value.measurements_id);
                });
                types = groupMeasurements();
            },
            // functions to get lists of details
            getMeasurement: getMeasurement,
            nutritionalsValues: function () {
                return nutritionals;
            },
            measurements: function () { return measurements; },
            measureTypes: function () { return measureTypes; },
            user: function () { return user },
            // function for nutritionals values
            multiplyNutritionals: function (initNutritionals,multBy) {
                var multNutritionals = [];
                var nut;
                angular.forEach(initNutritionals, function (value) {
                    multNutritionals.push({
                        id: value.id,
                        nutritional_value_id: value.nutritional_value_id,
                        product_id: value.product_id,
                        amount: value.amount_per_100 * multBy
                    });
                });
                return multNutritionals
            },
            // this function returns object contains default options for convertions:
            // -multiply - 1
            // - measure_type  - tools,
            // - convert_units  - false
            defaultConvertObject: function () {
               return {
                    multiply: 1,
                    measurement_type: measureTypes.filter(function (m) {
                        return m.measure_type1 === 'tools';
                    })[0],
                    convert_units: 0,
                };
            },
            // this function returns measurements, group by their types, order by amount - size
            groupMeasurements: function () {
                return types;
            },
        }
    })
})();
//{"id":13,"recipe_id":12,"product_id":32,"measurements_id":1,"amount":200,"measurement":null,"product":null,"recipe":null}
