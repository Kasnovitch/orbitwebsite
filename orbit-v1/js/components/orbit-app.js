/*
 * Purpose: Compose Orbit's page, global modal, and toast components.
 * Replaces the app shell and top-level event wiring from js/tasks.js.
 */
angular.module("orbit").component("orbitApp", {
  controller: ["$window", "ModalService", function ($window, ModalService) {
    var vm = this;

    // Replaces the sidebar class toggle with parent-owned state and one-way child input.
    vm.sidebarOpen = false;

    // Replaces the main-area listener while preserving its mobile width and menu exclusions.
    vm.mainClicked = function (event) {
      if ($window.innerWidth <= 650 && !event.target.closest(".mobile-menu")) {
        vm.sidebarOpen = false;
      }
    };

    // Replaces all create-task button listeners with one shared modal action.
    vm.openTask = function () {
      ModalService.open(null);
    };

    // Replaces the mobile menu listener; the app owns the mutable sidebar state.
    vm.toggleSidebar = function () {
      vm.sidebarOpen = !vm.sidebarOpen;
    };
  }],
  template: `
    <!-- Replaces the global sidebar markup and class toggles with components and ng-click. -->
    <div class="app-shell">
      <orbit-sidebar sidebar-open="$ctrl.sidebarOpen" on-create="$ctrl.openTask()"></orbit-sidebar>
      <!-- Replaces the static main area; click handling closes only the mobile sidebar. -->
      <main class="main-area" id="home" ng-click="$ctrl.mainClicked($event)">
        <orbit-topbar on-toggle="$ctrl.toggleSidebar()"></orbit-topbar>
        <div class="page-content">
          <orbit-welcome on-create="$ctrl.openTask()"></orbit-welcome>
          <!-- Metrics owns its full grid to keep the original grid children together. -->
          <orbit-metrics></orbit-metrics>
          <!-- Replaces manual task rendering while keeping the content-grid container in its owner. -->
          <section class="content-grid" id="tasks">
            <task-panel on-create="$ctrl.openTask()"></task-panel>
            <aside class="right-column"><upcoming-panel></upcoming-panel></aside>
          </section>
          <!-- Replaces the static footer without changing its text or classes. -->
          <footer class="page-footer"><span>ORBIT PERSONAL WORKSPACE</span><span>Your tasks are stored on this device.</span></footer>
        </div>
      </main>
      <task-modal></task-modal>
      <orbit-toast></orbit-toast>
    </div>
  `
});
