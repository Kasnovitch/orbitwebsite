/*
 * Purpose: Calculate and format task countdowns.
 * Replaces getCountdown() and formatCountdown() from js/countdown.js.
 */
angular.module("orbit").service("CountdownService", [function () {
  var units = [
    ["day", 86400000],
    ["hour", 3600000],
    ["minute", 60000],
    ["second", 1000]
  ];

  // Replaces getCountdown(): receives a shared clock value and omits the unused expired flag.
  this.getCountdown = function (dateValue, now) {
    var difference = new Date(dateValue).getTime() - new Date(now).getTime();
    var overdue = difference < 0;
    var remaining = Math.abs(difference);
    var values = {};

    units.forEach(function (unit) {
      values[unit[0]] = Math.floor(remaining / unit[1]);
      remaining %= unit[1];
    });

    values.overdue = overdue;
    return values;
  };

  // Replaces formatCountdown(): computes one reusable string for both task lists.
  this.formatCountdown = function (dateValue, now) {
    var result = this.getCountdown(dateValue, now);
    var dayPart = result.day + "d";
    var hourPart = String(result.hour).padStart(2, "0") + "h";
    var minutePart = String(result.minute).padStart(2, "0") + "m";
    var secondPart = String(result.second).padStart(2, "0") + "s";
    return (result.overdue ? "Overdue by " : "") +
      dayPart + " " + hourPart + " " + minutePart + " " + secondPart;
  };
}]);
