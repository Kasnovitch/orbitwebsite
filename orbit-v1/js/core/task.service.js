/*
 * Purpose: Own task state, CRUD operations, statistics, and deadline ordering.
 * Replaces task state and task CRUD/render calculations from js/tasks.js.
 */
angular.module("orbit").service("TaskService", [
  "StorageService", "ToastService", "ClockService", "$window",
  function (StorageService, ToastService, ClockService, $window) {
    var tasks = StorageService.loadTasks();
    var priorities = ["critical", "high", "medium", "low"];
    this.lastSaveSucceeded = true;

    // Replaces direct global-state reads; the stable array is shared with repeat-based views.
    this.all = function () {
      return tasks;
    };

    // Replaces makeId(): keeps UUID support and the legacy-compatible fallback.
    function makeId() {
      return $window.crypto && typeof $window.crypto.randomUUID === "function"
        ? $window.crypto.randomUUID()
        : "task-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    }

    // Replaces persist(): reports storage failure through the existing toast message.
    function persist() {
      this.lastSaveSucceeded = StorageService.saveTasks(tasks);
      if (!this.lastSaveSucceeded) {
        ToastService.show("Your changes could not be saved. Check your browser storage settings.");
      }
    }

    // Replaces task creation in saveTask(): stores the original data shape and timestamps.
    this.add = function (title, dueAt, priority) {
      var task = {
        id: makeId(),
        title: title,
        dueAt: dueAt,
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString()
      };
      tasks.push(task);
      persist.call(this);
      return task;
    };

    // Replaces the edit branch in saveTask(): mutates the saved task and persists it.
    this.update = function (id, changes) {
      var task = tasks.find(function (item) { return item.id === id; });
      if (!task) return null;
      task.title = changes.title;
      task.dueAt = changes.dueAt;
      task.priority = changes.priority;
      persist.call(this);
      return task;
    };

    // Replaces toggle handling: preserves completedAt's legacy behavior.
    this.toggle = function (id) {
      var task = tasks.find(function (item) { return item.id === id; });
      if (!task) return null;
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : null;
      persist.call(this);
      return task;
    };

    // Replaces filter-based deletion: splice preserves references held by Angular components.
    this.remove = function (id) {
      var index = tasks.findIndex(function (item) { return item.id === id; });
      if (index < 0) return null;
      var removed = tasks.splice(index, 1)[0];
      persist.call(this);
      return removed;
    };

    // Replaces inline metric calculations and updates overdue state from the shared clock.
    this.stats = function () {
      var active = tasks.filter(function (task) { return !task.completed; });
      return {
        active: active.length,
        completed: tasks.length - active.length,
        overdue: active.filter(this.isOverdue.bind(this)).length
      };
    };

    // Replaces renderUpcoming(): returns the nearest n active tasks for ng-repeat.
    this.upcoming = function (count) {
      return tasks.filter(function (task) { return !task.completed; })
        .slice()
        .sort(function (a, b) { return new Date(a.dueAt) - new Date(b.dueAt); })
        .slice(0, count);
    };

    // Replaces repeated deadline comparisons and uses ClockService's digest-updated time.
    this.isOverdue = function (task) {
      return !task.completed && new Date(task.dueAt).getTime() < ClockService.now.getTime();
    };

    // Keeps modal priority validation in the service API used by its component.
    this.isValidPriority = function (priority) {
      return priorities.includes(priority);
    };
  }
]);
