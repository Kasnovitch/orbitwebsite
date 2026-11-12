/*
 * Purpose: Share toast visibility and schedule its dismissal.
 * Replaces showToast() and its timeout state from js/tasks.js.
 */
angular.module("orbit").service("ToastService", ["$timeout", function ($timeout) {
  var service = this;
  service.message = "";
  service.visible = false;
  var dismissPromise = null;

  // Replaces showToast(): $timeout is cancellable and returns dismissal to the AngularJS digest.
  this.show = function (message) {
    service.message = message;
    service.visible = true;
    if (dismissPromise) $timeout.cancel(dismissPromise);
    dismissPromise = $timeout(function () {
      service.visible = false;
      dismissPromise = null;
    }, 2600);
  };
}]);
