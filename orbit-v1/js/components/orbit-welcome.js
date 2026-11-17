/*
 * Purpose: Render the welcome message and primary create-task action.
 * Replaces the welcome section and its button listener from index.html and js/tasks.js.
 */
angular.module("orbit").component("orbitWelcome", {
  bindings: {
    onCreate: "&"
  },
  controller: ["ClockService", function (ClockService) {
    var vm = this;

    // Replaces the static greeting: uses the same shared clock as the live dashboard.
    vm.greeting = function () {
      var hour = ClockService.now.getHours();
      return hour < 12 ? "Good morning." : hour < 18 ? "Good afternoon." : "Good evening.";
    };
  }],
  template: `
    <!-- Replaces the static welcome block and create-button event listener. -->
    <section class="welcome-row">
      <div>
        <div class="eyebrow">YOUR PERSONAL WORKSPACE</div>
        <h1 id="greeting">{{ $ctrl.greeting() }}</h1>
        <p class="welcome-copy">A clear view of what needs your attention.</p>
      </div>
      <button class="button button-primary" id="new-task-button" type="button" ng-click="$ctrl.onCreate()"><span class="button-plus">＋</span> New task</button>
    </section>
  `
});
