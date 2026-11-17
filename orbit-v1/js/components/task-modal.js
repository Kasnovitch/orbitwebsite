/*
 * Purpose: Render and validate task creation and editing.
 * Replaces openModal(), closeModal(), saveTask(), and modal event handlers from js/tasks.js.
 */
angular.module("orbit").component("taskModal", {
  controller: ["ModalService", "TaskService", "ToastService", "$document", "$timeout", function (
    ModalService, TaskService, ToastService, $document, $timeout
  ) {
    var vm = this;
    vm.modal = ModalService.state;

    // Replaces the document keydown listener; timeout enters AngularJS safely for external key events.
    vm.handleKeydown = function (event) {
      if (event.key === "Escape" && vm.modal.isOpen) {
        $timeout(function () {
          ModalService.close();
        });
      }
    };

    // Replaces saveTask(): validates custom messages and serializes the Date model as ISO.
    vm.save = function () {
      var title = vm.modal.title.trim();
      var deadline = vm.modal.deadline;
      if (!title) {
        vm.modal.error = "Enter a title for your task.";
        return;
      }
      if (!(deadline instanceof Date) || !Number.isFinite(deadline.getTime())) {
        vm.modal.error = "Choose a valid deadline.";
        return;
      }
      if (!TaskService.isValidPriority(vm.modal.priority)) {
        vm.modal.error = "Choose a valid priority.";
        return;
      }

      var dueAt = deadline.toISOString();
      if (vm.modal.taskId) {
        if (!TaskService.update(vm.modal.taskId, {
          title: title,
          dueAt: dueAt,
          priority: vm.modal.priority
        })) return;
        if (TaskService.lastSaveSucceeded) ToastService.show("Task updated.");
      } else {
        TaskService.add(title, dueAt, vm.modal.priority);
        if (TaskService.lastSaveSucceeded) ToastService.show("Task created.");
      }
      ModalService.close();
    };

    // Replaces the backdrop listener while only closing on a direct backdrop click.
    vm.backdropClicked = function (event) {
      if (event.target === event.currentTarget) ModalService.close();
    };

    // Replaces close and cancel listeners with the service-backed close action.
    vm.close = function () {
      ModalService.close();
    };

    // Registers the document listener for this component's lifetime instead of leaking a global handler.
    vm.$onInit = function () {
      $document.on("keydown", vm.handleKeydown);
    };

    // Removes the key listener when Angular destroys the modal component.
    vm.$onDestroy = function () {
      $document.off("keydown", vm.handleKeydown);
    };
  }],
  template: `
    <!-- Replaces the modal's class and aria DOM mutations with ng-show, ng-class, and bound state. -->
    <div class="modal-backdrop" id="task-modal" ng-show="$ctrl.modal.isOpen" ng-class="{ 'is-open': $ctrl.modal.isOpen }" ng-attr-aria-hidden="{{ $ctrl.modal.isOpen ? 'false' : 'true' }}" ng-click="$ctrl.backdropClicked($event)">
      <section class="task-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-heading">
          <div><div class="eyebrow">TASK DETAILS</div><h2 id="modal-title">{{ $ctrl.modal.taskId ? 'Edit task' : 'Create a task' }}</h2><p>Give your task a name, deadline and priority.</p></div>
          <button class="icon-button" id="close-modal" type="button" aria-label="Close dialog" ng-click="$ctrl.close()">×</button>
        </div>
        <!-- novalidate preserves the original custom validation messages instead of browser prompts. -->
        <form id="task-form" novalidate ng-submit="$ctrl.save()">
          <input type="hidden" id="task-id" ng-model="$ctrl.modal.taskId">
          <label class="form-field"><span>Task title</span><input id="task-title" type="text" maxlength="120" placeholder="What needs to get done?" required ng-model="$ctrl.modal.title" orbit-focus="{{ $ctrl.modal.isOpen }}"></label>
          <!-- ModalService supplies the Date model; save serializes it as ISO, replacing toLocalInputValue(). -->
          <label class="form-field"><span>Due date and time</span><input id="task-deadline" type="datetime-local" required ng-model="$ctrl.modal.deadline"></label>
          <label class="form-field"><span>Priority</span><select id="task-priority" required ng-model="$ctrl.modal.priority"><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
          <div class="form-error" role="alert">{{ $ctrl.modal.error }}</div>
          <div class="modal-actions"><button class="button button-quiet" id="cancel-modal" type="button" ng-click="$ctrl.close()">Cancel</button><button class="button button-primary" id="save-task-button" type="submit">{{ $ctrl.modal.taskId ? 'Save changes' : 'Create task' }}</button></div>
        </form>
      </section>
    </div>
  `
});
