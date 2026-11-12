/*
 * Purpose: Publish the current time to components and filters.
 * Replaces setInterval(), setToday(), and updateCountdowns() from js/tasks.js.
 */
angular.module("orbit").service("ClockService", ["$interval", function ($interval) {
  var service = this;
  service.now = new Date();

  // Replaces setInterval(): $interval participates in AngularJS digests so times and filters refresh together.
  $interval(function () {
    service.now = new Date();
  }, 1000);
}]);
