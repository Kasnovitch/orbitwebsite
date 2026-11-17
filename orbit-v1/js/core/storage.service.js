/*
 * Purpose: Read and write validated task data in local storage.
 * Replaces loadTasks() and saveTasks() from js/storage.js.
 */
angular.module("orbit").service("StorageService", ["$window", function ($window) {
  var storageKey = "orbit.v1.tasks";

  // Replaces loadTasks(): injects the browser window and keeps the original schema validation.
  this.loadTasks = function () {
    try {
      var saved = $window.localStorage.getItem(storageKey);
      if (!saved) return [];
      var parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (task) {
        return task &&
          typeof task.id === "string" &&
          typeof task.title === "string" &&
          typeof task.dueAt === "string" &&
          ["critical", "high", "medium", "low"].includes(task.priority) &&
          typeof task.completed === "boolean" &&
          Number.isFinite(new Date(task.dueAt).getTime());
      });
    } catch (error) {
      console.error("Orbit could not read saved tasks:", error);
      return [];
    }
  };

  // Replaces saveTasks(): centralizes storage access while preserving its success result and logging.
  this.saveTasks = function (tasks) {
    try {
      $window.localStorage.setItem(storageKey, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error("Orbit could not save tasks:", error);
      return false;
    }
  };
}]);
