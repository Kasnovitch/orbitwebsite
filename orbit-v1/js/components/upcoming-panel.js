/*
 * Purpose: Render upcoming deadlines and the adjacent clarity note.
 * Replaces renderUpcoming() and its duplicated countdown refresh logic from js/tasks.js.
 */
angular.module("orbit").component("upcomingPanel", {
  controller: ["TaskService", "ClockService", function (TaskService, ClockService) {
    // Replaces renderUpcoming(): TaskService returns the five nearest active tasks for ng-repeat.
    this.tasks = function () {
      return TaskService.upcoming(5);
    };

    // Replaces a separately updated list countdown using the same ClockService value as task rows.
    this.now = function () {
      return ClockService.now;
    };
  }],
  template: `
    <!-- Replaces upcoming DOM construction and style.display updates with repeat and ng-show. -->
    <section class="panel upcoming-panel">
      <div class="compact-panel-heading"><div><div class="eyebrow">WHAT'S NEXT</div><h2>Upcoming deadlines</h2></div><span class="heading-icon">◷</span></div>
      <div class="upcoming-list" id="upcoming-list">
        <!-- track by preserves upcoming items while their countdown text refreshes each second. -->
        <div class="upcoming-item" ng-repeat="t in $ctrl.tasks() track by t.id">
          <span class="upcoming-marker" ng-class="'priority-' + t.priority"></span>
          <div class="upcoming-info">
            <div class="upcoming-title">{{ t.title }}</div>
            <div class="upcoming-date">{{ t.dueAt | orbitDate:'date' }} · {{ t.dueAt | countdown:$ctrl.now() }}</div>
          </div>
        </div>
      </div>
      <!-- ng-show controls this legacy-hidden block; the inline baseline lets its original CSS hide rule be overridden. -->
      <div class="upcoming-empty" id="upcoming-empty" style="display:block" ng-show="!$ctrl.tasks().length">Your upcoming deadlines will appear here.</div>
    </section>
    <!-- Replaces the static note as an owned sibling in the existing right-column grid. -->
    <section class="note-panel">
      <div class="note-mark">✳</div>
      <div><span class="eyebrow">A LITTLE CLARITY</span><p>One thing at a time. Keep your next deadline in view.</p></div>
    </section>
  `
});
