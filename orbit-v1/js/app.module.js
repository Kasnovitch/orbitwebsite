/*
 * Purpose: Define Orbit's AngularJS application module and focus directive.
 * Replaces the global bootstrap in js/app.js and the DOM-ready initializer.
 */
angular.module("orbit", [])
  .directive("orbitFocus", ["$timeout", function ($timeout) {
    return {
      restrict: "A",
      link: function (scope, element, attrs) {
        // Replaces the modal's setTimeout focus call with a digest-aware directive.
        attrs.$observe("orbitFocus", function (value) {
          if (value === "true") {
            $timeout(function () {
              element[0].focus();
            });
          }
        });
      }
    };
  }]);
