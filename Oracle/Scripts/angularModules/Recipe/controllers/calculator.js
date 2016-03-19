/// <reference path="../../../plugin/own.js" />
(function () {
    function calc($scope, convertFilter,DetailsFactory) {
        var measurements_type = $scope.measurement_type = DetailsFactory.measureTypes().filter(function (m) {
            return m.id <= 3;
        });
        var original = $scope.products;
        //$scope.convert = function () {
        //    $scope.products = convertFilter($scope.products, $scope.config);
        //}
        $scope.reset = function () {
            $scope.products = original;
        }

        measurements_type.unshift($scope.config.measurement_type);
        
        // object contains default options for
       // $scope.config = DetailsFactory.defaultConvertObject();

        $scope.portions = portions = {
            portions: $scope.recipe.portions,
            operations: ['+', '-', '/', '*'],
            calculate: function (oper) {
                var ans = portions.shouldbe, operand = portions.operand;
                switch (oper) {
                    case '+':
                        ans += operand;
                        break;
                    case '-':
                        ans -= operand;
                        break;
                    case '*':
                        ans *= operand;
                        break;
                    case '/':
                        if (operand !== 0)
                            ans /= operand;
                        break;
                    default:
                        break;
                }
                ans = Math.round(ans);
                if (ans < 1)
                    ans = 1;
                portions.shouldbe = ans;
                $scope.config.multiply = portions.shouldbe / portions.portions;
                $scope.config.portions = portions.shouldbe;
            },
            operand: 1,
            shouldbe: 1,
            reset: function () {
                portions.shouldbe = portions.portions;
            },
        }
        portions.shouldbe = portions.portions;
        portions.calculate('*');

        $scope.words = {
            measure_type: 'Display all measure like this:',
            types: {
                tools: 'Tools (cup, spoon, etc..)',
                weight: 'Weight (gr, mg, etc...)',
                volume: 'Volume (ml, liter, etc...)',
                remain: "Don't change"
            },
            units: 'Convert Units to this measure ',
            amount: 'Convert Portions',
            ok: 'Convert',
            reset: 'Reset',
        }
    }
    angular.module('controllers').controller('calculatorCtrl', ['$scope', 'convertfFilter','DetailsFactory', calc]);
})();