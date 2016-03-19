/// <reference path="../../../plugin/own.js" />
(function () {
    // this function filter an array of products - recipe to requested display
    function filter(cf,constf) {

        // constructor of product recipe object, based on old one
        function ProductRecipe(product){
            this.id = product.id;
            this.recipe_id = product.recipe_id;
            this.product_id = product.product_id;
            this.measurements_id = product.measurements_id;
            this.amount = product.amount;
        }

        ProductRecipe.prototype.multiply = function (mult) {
            this.amount *= mult;
            this.amount = round(this.amount, 2);
        }

        ProductRecipe.prototype.convert = function (measure_type, convert_unit) {
            if(!(this.measurements_id === constf.measurement_id.tools && measure_type.id !== constf.measure_type_id.tools && !convert_unit)) {
                cf.convertMeasure(this, measure_type);
            }
        }

        ProductRecipe.prototype.setMeasure = function (ifUnit) {
            var convert = cf.closerMeasure(this);
            this.amount = convert.amount;
            this.measurements_id = convert.measurements_id;
            this.product = convert.product;
            this.measurement = convert.measurement;
        }

        // input - array of products recipe
        // config - object contains details of convertion
        //   - multiply: multiply these amounts by...
        //   - measurement type: convert amount to this measurement type
        //   - convert units: boolean, convert unit measurement or no
        //   - 
        function calc(input, config) {
            var products = [];

            // create new array for return array
            input.forEach(function (p) {
                products.push(new ProductRecipe(p));
            });
            // multiply amounts
            if (typeof config.multiply !== 'undefined' && config.multiply !== 1) {
                products.forEach(function (p) {
                    p.multiply(config.multiply);
                });
            }
            // convert measurements
            if (typeof config.measurement_type !== 'undefined') {
                products.forEach(function (p) {
                    p.convert(config.measurement_type, config.convert_unit);
                });
            }
            products.forEach(function (p) {
                p.setMeasure(config.convert_unit);
            });
            return products;
        }
        return calc;
    };

    angular.module('filters').filter('convert', ['convertFactory', 'constantFactory', filter]);



    function filtServing() {
        function calc(input, amount) {
            return amount;
        }
        return calc;
    };
    angular.module('filters').filter('serving', [filtServing]);

    function filtAmounts(DetailsFactory, convertFactory, constantFactory) {
        function calc(input, config) {
            var output = new Array(), out;
            angular.forEach(input, function (p) {
                out = create(p);
                
                
                if (config.measurement_type.id > 0)
                {
                    if (out.measurement.measure_type_id !== config.measurement_type.id) {
                        if (out.measurements_id !== constantFactory.measurement_id.tools || config.convert_units) {
                            convertFactory.convertMeasure(out, config.measurement_type);
                            out = convertFactory.closerMeasure(out);
                        }
                    }

                }

                out.product_name = out.product.name;
                if (out.amount > 1) {
                    if (out.measurement.name == 'unit') {
                        out.product_name = out.product_name.pluralize();
                    } else {
                        out.measurement_name = out.measurement.name.pluralize();                       
                    }
                }
                else {
                    if (out.measurement.name == 'unit') {
                        out.product_name = out.product_name.singularize().toString();
                    } else {
                        out.measurement_name = out.measurement.name.singularize().toString();
                    }
                }
                if (out.measurement.name == 'unit')
                    out.measurement_name = '';
                out.amount = round(out.amount * config.multiply, 2);
                output.push(out);
            });

            return output;
        }
        calc.$stateful = true;
        return calc;
    }
    /*amount: 0.3
id: 13
measurement: Object
alias: "cup"
amount: 200
id: 5
measure_type: "tools"
measure_type_id: 3
measurement_id: 2
name: "cup"
__proto__: Object
measurements_id: 5
product: Product
amount_weight_in_volume: 1.23
approved: true
description: "special for baking,cooking &"
id: 7
measure_type: Object
name: "date's spreed"
nutritionalValue: Array[7]
nutritional_per: undefined
products_in_nutritional_value: Array[7]
products_in_recipe: Array[0]
unit_amount: 100
user_id: 5
weight_in_volume: undefined
__proto__: Product
product_id: 7
recipe: null
recipe_id: 12*/
    angular.module('filters').filter('convertf', ['DetailsFactory', 'convertFactory','constantFactory', filtAmounts]);

    function filtmeasurep() {
        function calc(input, amount) {
            if (input == 'unit')
                return '';
            if (amount <= 1)
                return input;
            return input.pluralize();
        }
        return calc;
    }
    angular.module('filters').filter('measurep', [filtmeasurep]);

    function filtIngp() {
        function calc(input, measure, amount) {
            if(measure !== 'unit' || amount <= 1)
                return input;
            return input.pluralize();
        }
        return calc;
    }
    angular.module('filters').filter('ingrediantp', [filtIngp]);
    
})();