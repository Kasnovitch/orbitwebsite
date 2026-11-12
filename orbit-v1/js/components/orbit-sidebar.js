/*
 * Purpose: Render navigation, active-task count, and the sidebar create action.
 * Replaces the sidebar markup and its direct DOM updates from index.html and js/tasks.js.
 */
angular.module("orbit").component("orbitSidebar", {
  bindings: {
    sidebarOpen: "<",
    onCreate: "&"
  },
  controller: ["TaskService", function (TaskService) {
    // Replaces the manually updated navigation count with service-backed Angular binding.
    this.activeCount = function () {
      return TaskService.stats().active;
    };
  }],
  template: `
    <!-- Replaces #sidebar markup and classList.toggle with component bindings and ng-class. -->
    <aside class="sidebar" id="sidebar" ng-class="{ 'is-open': $ctrl.sidebarOpen }">
      <a class="brand" href="#home" aria-label="Orbit home">
        <span class="brand-mark" aria-hidden="true"><span></span></span>
        <span class="brand-name">orbit</span>
      </a>
      <div class="sidebar-label">WORKSPACE</div>
      <nav class="primary-nav" aria-label="Main navigation">
        <a class="nav-link is-active" href="#home" aria-current="page"><span class="nav-icon">⌂</span><span>Overview</span></a>
        <a class="nav-link" href="#tasks"><span class="nav-icon">▤</span><span>Tasks</span><span class="nav-count" id="nav-active-count">{{ $ctrl.activeCount() }}</span></a>
      </nav>
      <div class="sidebar-rule"></div>
      <div class="sidebar-label">QUICK ACTION</div>
      <button class="sidebar-create" id="sidebar-add-task" type="button" ng-click="$ctrl.onCreate()"><span>＋</span> Create a task</button>
      <div class="sidebar-bottom">
        <div class="workspace-chip"><span class="workspace-avatar">O</span><span><strong>Personal workspace</strong><small>Private workspace</small></span></div>
        <div class="version-label">ORBIT <span>VERSION 1.0</span></div>
      </div>
    </aside>
  `
});
