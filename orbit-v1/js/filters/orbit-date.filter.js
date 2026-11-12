/*
 * Purpose: Format Orbit dates and times with the browser's locale.
 * Replaces formatDate() and setToday() formatting from js/tasks.js.
 */
angular.module("orbit").filter("orbitDate", [function () {
  // Replaces formatDate(): Intl keeps locale behavior without Angular's built-in date filter.
  return function (dateValue, format) {
    var date = new Date(dateValue);
    var formats = {
      date: { day: "numeric", month: "short", year: "numeric" },
      today: { weekday: "short", day: "numeric", month: "short", year: "numeric" },
      time: { hour: "2-digit", minute: "2-digit", hour12: false },
      longDate: { weekday: "long", day: "numeric", month: "long" },
      deadlineTime: { hour: "2-digit", minute: "2-digit" }
    };
    return new Intl.DateTimeFormat(undefined, formats[format] || formats.date).format(date);
  };
}]);
