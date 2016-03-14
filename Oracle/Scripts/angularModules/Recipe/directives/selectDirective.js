(function () {
    angular.module('directives').directive('select', function ($interpolate) {
        return {
            restrict: 'E',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var defaultOptionTemplate;
                scope.defaultOptionText = attrs.defaultOption || 'Select...';
                defaultOptionTemplate = '<option value="" disabled selected class="ca_join_type">{{defaultOptionText}}</option>';
                elem.prepend($interpolate(defaultOptionTemplate)(scope));
            }
        };
    })
})();
