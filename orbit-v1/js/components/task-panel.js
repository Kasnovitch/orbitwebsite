/*
 * Purpose: Render searchable, sortable task rows and their actions.
 * Replaces getVisibleTasks(), createTaskRow(), renderTasks(), and task click delegation in js/tasks.js.
 */
angular.module("orbit").component("taskPanel", {
  bindings: {
    onCreate: "&"
  },
  controller: ["TaskService", "ClockService", "ModalService", "ToastService", "$window", function (
    TaskService, ClockService, ModalService, ToastService, $window
  ) {
    var vm = this;
    vm.tasks = TaskService.all();
    vm.filters = { search: "", priority: "all", status: "active" };

    // Replaces getVisibleTasks(): computes filter and sort results from the live clock on each digest.
    vm.visible = function () {
      var now = ClockService.now.getTime();
      return vm.tasks.filter(function (task) {
        var matchesSearch = task.title.toLowerCase().includes(vm.filters.search.trim().toLowerCase());
        var matchesPriority = vm.filters.priority === "all" || task.priority === vm.filters.priority;
        var overdue = !task.completed && new Date(task.dueAt).getTime() < now;
        var matchesStatus = vm.filters.status === "all" ||
          (vm.filters.status === "active" && !task.completed) ||
          (vm.filters.status === "completed" && task.completed) ||
          (vm.filters.status === "overdue" && overdue);
        return matchesSearch && matchesPriority && matchesStatus;
      }).sort(function (a, b) {
        if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
        return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
      });
    };

    // Replaces the visible task-summary DOM write with a bound view calculation.
    vm.summary = function () {
      var count = vm.visible().length;
      return count + " " + (count === 1 ? "task" : "tasks");
    };

    // Replaces row-time overdue checks with TaskService's shared-clock calculation.
    vm.isOverdue = TaskService.isOverdue;

    // Replaces direct Date.now() calls so both countdown filters and row classes share one tick.
    vm.now = function () {
      return ClockService.now;
    };

    // Replaces the delegated toggle action while retaining the existing toast text.
    vm.toggle = function (task) {
      var changed = TaskService.toggle(task.id);
      // Unlike the old event order, a success toast no longer masks a failed storage save.
      if (changed && TaskService.lastSaveSucceeded) {
        ToastService.show(changed.completed ? "Task marked as complete." : "Task restored to active tasks.");
      }
    };

    // Replaces the delegated edit action and opens the shared modal draft.
    vm.edit = function (task) {
      ModalService.open(task);
    };

    // Replaces the delegated delete action; confirmation stays unchanged and storage failures remain visible.
    vm.remove = function (task) {
      if (!$window.confirm('Delete "' + task.title + '"? This cannot be undone.')) return;
      if (TaskService.remove(task.id) && TaskService.lastSaveSucceeded) {
        ToastService.show("Task deleted.");
      }
    };

    // Replaces manual empty-state messages with values bound to the task collection.
    vm.emptyTitle = function () {
      return vm.tasks.length ? "No matching tasks" : "Nothing on your list yet";
    };

    // Replaces manual empty-state messages with values bound to the task collection.
    vm.emptyCopy = function () {
      return vm.tasks.length
        ? "Try changing your search or filters."
        : "Add a task and give yourself a clear next step.";
    };

    // Replaces direct priority lookup during row creation with a stable display mapping.
    vm.priorityName = function (priority) {
      return { critical: "Critical", high: "High", medium: "Medium", low: "Low" }[priority];
    };

  }],
  template: `
    <!-- Replaces .task-panel markup; ng-model replaces filter listeners and keeps labels intact. -->
    <div class="task-panel panel">
      <div class="panel-heading task-panel-heading">
        <div><div class="eyebrow">YOUR WORKLOAD</div><h2>Tasks</h2><p class="panel-subtitle">Everything you need to keep moving.</p></div>
        <button class="button button-secondary button-small" id="panel-add-task" type="button" ng-click="$ctrl.onCreate()">＋ Add task</button>
      </div>
      <div class="toolbar">
        <label class="search-field"><span aria-hidden="true">⌕</span><input id="task-search" type="search" placeholder="Search your tasks" autocomplete="off" ng-model="$ctrl.filters.search"></label>
        <label class="select-wrap"><span class="sr-only">Filter by priority</span><select id="priority-filter" ng-model="$ctrl.filters.priority"><option value="all">All priorities</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
        <label class="select-wrap"><span class="sr-only">Filter by status</span><select id="status-filter" ng-model="$ctrl.filters.status"><option value="active">Active tasks</option><option value="all">All tasks</option><option value="completed">Completed</option><option value="overdue">Overdue</option></select></label>
      </div>
      <div class="task-table-wrap">
        <div class="task-table-head"><span class="task-col-title">TASK</span><span>PRIORITY</span><span>DEADLINE</span><span>TIME LEFT</span><span class="task-col-action"> </span></div>
        <!-- Rows remain inside task-panel so CSS grid relationships are preserved. track by avoids replacing rows on each clock digest. -->
        <div class="task-list" id="task-list" aria-live="polite">
          <div class="task-row" ng-repeat="t in $ctrl.visible() track by t.id" ng-class="{ 'is-completed': t.completed }">
            <div class="task-name-wrap">
              <button class="task-check" type="button" ng-class="{ 'is-checked': t.completed }" aria-label="{{ t.completed ? 'Mark task as active' : 'Mark task as complete' }}" ng-click="$ctrl.toggle(t)">{{ t.completed ? '✓' : '' }}</button>
              <!-- Angular interpolation escapes task text; the unused vanilla escapeText helper is no longer needed. -->
              <span class="task-title">{{ t.title }}</span>
            </div>
            <div class="priority-cell"><span class="priority-pill" ng-class="'priority-' + t.priority">{{ $ctrl.priorityName(t.priority) }}</span></div>
            <div class="deadline-cell">{{ t.dueAt | orbitDate:'date' }}<small>{{ t.dueAt | orbitDate:'deadlineTime' }}</small></div>
            <div class="countdown-cell" ng-class="{ 'is-completed': t.completed, 'is-overdue': !t.completed && $ctrl.isOverdue(t) }">{{ t.completed ? 'Completed' : (t.dueAt | countdown:$ctrl.now()) }}</div>
            <div class="row-actions">
              <button class="row-menu-button" type="button" aria-label="Edit {{ t.title }}" ng-click="$ctrl.edit(t)">✎</button>
              <button class="row-menu-button" type="button" aria-label="Delete {{ t.title }}" ng-click="$ctrl.remove(t)">×</button>
            </div>
          </div>
        </div>
        <!-- Replaces the classList-managed empty state with ng-class and live task status. -->
        <div class="empty-state" id="empty-state" ng-class="{ 'is-visible': !$ctrl.visible().length }">
          <div class="empty-state-mark">○</div>
          <h3 id="empty-title">{{ $ctrl.emptyTitle() }}</h3>
          <p id="empty-copy">{{ $ctrl.emptyCopy() }}</p>
          <button class="button button-secondary" id="empty-add-task" type="button" ng-click="$ctrl.onCreate()">Create your first task</button>
        </div>
      </div>
      <div class="panel-footer"><span id="task-summary">{{ $ctrl.summary() }}</span><span>Sorted by nearest deadline</span></div>
    </div>
  `
});
