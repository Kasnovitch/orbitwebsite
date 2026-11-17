/*
 * Purpose: Render live task countdown labels.
 * Replaces direct countdown text updates from js/tasks.js.
 */
angular.module("orbit").filter("countdown", ["CountdownService", function (CountdownService) {
  // Replaces updateCountdowns(): the filter re-evaluates whenever ClockService.now changes.
  return function (dueAt, now) {
    return CountdownService.formatCountdown(dueAt, now);
  };
}]);
