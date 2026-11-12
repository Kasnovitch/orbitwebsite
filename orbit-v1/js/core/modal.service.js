/*
 * Purpose: Hold modal visibility, editing identity, and the bound task draft.
 * Replaces openModal() and closeModal() from js/tasks.js.
 */
angular.module("orbit").service("ModalService", [function () {
  this.state = {
    isOpen: false,
    taskId: "",
    title: "",
    deadline: null,
    priority: "medium",
    error: ""
  };

  // Replaces openModal(): keeps modal state in one service and supplies Date for datetime-local ng-model.
  this.open = function (task) {
    var state = this.state;
    state.isOpen = true;
    state.taskId = task ? task.id : "";
    state.title = task ? task.title : "";
    state.deadline = null;
    if (task) {
      state.deadline = new Date(task.dueAt);
      state.deadline.setSeconds(0, 0);
    }
    state.priority = task ? task.priority : "medium";
    state.error = "";
  };

  // Replaces closeModal(): Angular bindings update visibility and aria-hidden together.
  this.close = function () {
    this.state.isOpen = false;
  };
}]);
