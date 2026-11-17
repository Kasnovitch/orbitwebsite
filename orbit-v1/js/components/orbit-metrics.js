/*
 * Purpose: Render task counts, local clock, and full overview grid.
 * Replaces metric DOM updates and setToday() from js/tasks.js.
 */
angular.module("orbit").component("orbitMetrics", {
  controller: ["TaskService", "ClockService", function (TaskService, ClockService) {
    // Replaces renderTasks() metric writes; overdue counts now refresh with the shared clock.
    this.stats = function () {
      return TaskService.stats();
    };

    // Replaces the old clock/date writes with one locale-formatted shared value.
    this.now = function () {
      return ClockService.now;
    };
  }],
  template: `
    <!-- Replaces the metrics section; this component owns the entire overview grid. -->
    <section class="overview-grid" aria-label="Task overview">
      <article class="metric-card">
        <div class="metric-top"><span>Active tasks</span><span class="metric-symbol">↗</span></div>
        <div class="metric-value" id="active-count">{{ $ctrl.stats().active }}</div>
        <div class="metric-foot">Tasks still in progress</div>
      </article>
      <article class="metric-card">
        <div class="metric-top"><span>Completed</span><span class="metric-symbol">✓</span></div>
        <div class="metric-value" id="completed-count">{{ $ctrl.stats().completed }}</div>
        <div class="metric-foot">Tasks you've finished</div>
      </article>
      <article class="metric-card">
        <div class="metric-top"><span>Overdue</span><span class="metric-symbol metric-symbol-alert">!</span></div>
        <div class="metric-value" id="overdue-count">{{ $ctrl.stats().overdue }}</div>
        <div class="metric-foot">Past their deadline</div>
      </article>
      <article class="metric-card metric-card-date">
        <div class="metric-top"><span>Today</span><span class="metric-symbol">◷</span></div>
        <div class="metric-date-value" id="clock-value">{{ $ctrl.now() | orbitDate:'time' }}</div>
        <div class="metric-foot" id="date-value">{{ $ctrl.now() | orbitDate:'longDate' }}</div>
      </article>
    </section>
  `
});
