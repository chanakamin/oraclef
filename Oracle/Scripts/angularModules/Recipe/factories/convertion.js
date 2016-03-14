/// <reference path="../../../plugin/own.js" />
(function () {
    function fac(constf) {
        var dtf , prf , recf ;
        var words = {
            weight: 'weight',
            tools: 'tools',
            volume: 'volume',
        };
        // function to calculate amount per requested measurement
        // arguments: the current amount and measurement, requested measurement and specific weight
        function requestAmount(curAmount, curMeasurement, reqMeasurement, product) {
            if (curMeasurement.id == reqMeasurement.id)
                return curAmount;
            var amount_per_base = curAmount,
                amount_per_reqB;
            var baseCur = dtf.getMeasurement(curMeasurement.measurement_id),
                baseReq = dtf.getMeasurement(reqMeasurement.measurement_id);
            // get amount per base:
            // if it is unit
            if (curMeasurement.id === curMeasurement.measurement_id && curMeasurement.id !== curMeasurement.measure_type_id) {
                amount_per_base *= product.unit_amount;
            }
            else
                amount_per_base *= curMeasurement.amount;

            // get amount per request
            // if it is unit
            if (reqMeasurement.id === reqMeasurement.measurement_id && reqMeasurement.id !== reqMeasurement.measure_type_id) {
                amount_per_reqB = amount_per_base / product.unit_amount;
            }
                // if request measurement type is equal to current measurement
            else {
                if (baseCur.id === baseReq.id) {
                    amount_per_reqB = amount_per_base;
                } else if (baseCur.measure_type_id == constf.measure_type_id.weight) // convert from weight to volume
                    amount_per_reqB = amount_per_base / product.amount_weight_in_volume;
                else if (baseCur.measure_type_id == constf.measure_type_id.volume) //convert from volume to weight
                    amount_per_reqB = amount_per_base * product.amount_weight_in_volume;
                amount_per_reqB /= reqMeasurement.amount;
                //if (reqMeasurement.measure_type_id === constf.measure_type_id.tools) {
                //    amount_per_reqB /= reqMeasurement.amount;
                //}
                //else {
                //    amount_per_base *= reqMeasurement.amount;
                //}
            }
            return amount_per_reqB;
        }
        // this function returns amount of base measurement of product
        // arguments: product object, measurementId it now being measured, the amount
        function amountPerBase(product, measurementId, amount) {
            var cur_measurement = dtf.getMeasurement(measurementId),
                requested_measurement = dtf.getMeasurement(product.measure_type.id);
            return requestAmount(amount, cur_measurement, requested_measurement, product);
        }

        // This function calculate nutritional value amount in product upon its amount per base
        // arguments: product_in_nutritionalValue object, amount per base
        function calcAmountNut(nutritionalProduct, product_amount_per_base) {
            var ratio = product_amount_per_base / 100;
            var result = ratio * nutritionalProduct.amount_per_100;
            return result;
        }

        // convert product_recipe from measurement to another measurement - same measure type
        function measureToMeasuret(productRecipe, measurement) {
            var measureBase = dtf.getMeasurement(productRecipe.measurements_id);
            var ratio = measureBase.amount / measurement.amount;
            productRecipe.amount *= ratio;
        }

        // return apprpiate measurement to product recipe.
        function closeMeasure(product_recipe) {
            var measurement = dtf.getMeasurement(product_recipe.measurements_id), prt = create(product_recipe), prd = create(product_recipe);
            var measuretype = dtf.groupMeasurements()[measurement.measure_type_id];
            var list = measuretype.list, l = list.length, i;
            i = list.findIndex(function (m) {
                return m.id === measurement.id;
            });
            if (i === -1)
                return false;
            if (i === l)
                return product_recipe;
            measureToMeasuret(prt, list[i + 1]);
            if (i > 0)
                measureToMeasuret(prd, list[i - 1]);
            // if product is weight / volume
            if (measuretype.measure_type.measure_type1 !== words.tools) {
                if (Math.floor(prt.amount) > Math.floor(product_recipe.amount)) {
                    return prt;
                }
                else if (Math.floor(prd.amount) < Math.floor(product_recipe.amount)) {
                    return prd;
                }
            }
                // if product is tool
            else {
                if (round(prt.amount, 2) > 0.5)
                    return prt;
                if (round(product_recipe.amount, 2) < 0.5)
                    return prd;
            }
            product_recipe.measurement = dtf.getMeasurement(product_recipe.measurements_id);
            product_recipe.product = prf.getProduct(product_recipe.product_id);
            return product_recipe;
        }

        return {
            init: function () {
                var fact = angular.module('factoryModule').factories;
                dtf = fact.details, prf = fact.products, recf = fact.recipes;
            },
            requestAmount: requestAmount,
            multiplyNutritionals: function (initNutritionals, multBy) {
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
            // this function returns array of nutritionals values for products list - productsRecipe.
            calcNutrition: function (productsRecipe) {
                var nut = [], nutritionals = dtf.nutritionalsValues();
                var pr, nu;
                var amount_per_base;
                // prepare array of nutritional result, value is steal empty.
                angular.forEach(nutritionals, function (n) {
                    var obj = { name: n.name, value: 0, id: n.id };
                    nut.push(obj);
                    nut[n.name] = obj;
                });
                // loop on every product to add his nutritionals to array
                angular.forEach(productsRecipe, function (p) {
                    // pr - regular product
                    pr = prf.getProduct(p.product_id)
                    amount_per_base = amountPerBase(pr, p.measurements_id, p.amount);
                    // loop for every nutritional to calc its value and add it to the array
                    angular.forEach(nut, function (n) {
                        // find the nutritional in product element in product's array of it
                        nu = pr.nutritionalValue.filter(function (nutr) {
                            return nutr.nutritional_value_id == n.id;
                        })[0];
                        if (nu && pr && p)
                            // add the nutritional amount
                            n.value += calcAmountNut(nu, amount_per_base);
                    });
                })
                return nut;
            },
            // this function get product-recipe object and check for his amount the best measurement to use.
            closerMeasure: function (product_recipe) {
                return closeMeasure(product_recipe);
            },
            // function to convert product recipe to another measure type.
            convertMeasure: function (product_recipe, measure_type) {
                var product = prf.getProduct(product_recipe.product_id), measure = dtf.getMeasurement(product_recipe.measurements_id);
                var reqMeasure = dtf.groupMeasurements()[measure_type.id].list[0];
                var amount = requestAmount(product_recipe.amount, measure, reqMeasure, product);
                if (typeof amount === 'number') {
                    product_recipe.measurements_id = reqMeasure.id;
                    product_recipe.amount = amount;
                }
            }
        }
    }
    angular.module("factoryModule").factory('convertFactory',['constantFactory',fac]);
})();