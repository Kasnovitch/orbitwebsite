/*
 * Purpose: Render responsive navigation, date, and time-sensitive greeting.
 * Replaces the topbar markup and setToday() text updates from index.html and js/tasks.js.
 */
angular.module("orbit").component("orbitTopbar", {
  bindings: {
    onToggle: "&"
  },
  controller: ["ClockService", function (ClockService) {
    var vm = this;

    // Replaces setToday(): derives the greeting from the shared clock on each digest.
    vm.greeting = function () {
      var hour = ClockService.now.getHours();
      return hour < 12 ? "Good morning." : hour < 18 ? "Good afternoon." : "Good evening.";
    };

    // Replaces direct date/time DOM writes with locale-aware filter inputs.
    vm.now = function () {
      return ClockService.now;
    };
  }],
  template: `
    <!-- Replaces the header and mobile-menu listener with one-way callback binding. -->
    <header class="topbar">
      <button class="mobile-menu" id="mobile-menu" type="button" aria-label="Toggle navigation" ng-click="$ctrl.onToggle()">☰</button>
      <div class="breadcrumb"><span>Workspace</span><span class="breadcrumb-separator">/</span><strong>Overview</strong></div>
      <div class="topbar-right">
        <div class="today-label"><span class="status-dot"></span><span id="today-label">{{ $ctrl.now() | orbitDate:'today' }}</span></div>
        <div class="profile-avatar" aria-label="Personal workspace">O</div>
      </div>
    </header>
  `
});
