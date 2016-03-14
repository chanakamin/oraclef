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

    angular.module('filters').filter('convert', ['convertFactory','constantFactory',filter]);
})();