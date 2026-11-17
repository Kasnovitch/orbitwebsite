/*
 * Purpose: Display transient status messages from ToastService.
 * Replaces the manually mutated #toast element and showToast() from js/tasks.js.
 */
angular.module("orbit").component("orbitToast", {
  controller: ["ToastService", function (ToastService) {
    // Replaces toast element mutations with one service-backed component view.
    this.toast = ToastService;
  }],
  template: `
    <!-- Replaces showToast() DOM changes with bound visibility and unchanged live-region attributes. -->
    <div class="toast" id="toast" role="status" aria-live="polite" ng-class="{ 'is-visible': $ctrl.toast.visible }">{{ $ctrl.toast.message }}</div>
  `
});
