(() => {
  const PRIORITIES = ["critical", "high", "medium", "low"];
  let tasks = window.OrbitStorage.loadTasks();
  let filters = { search: "", priority: "all", status: "active" };
  let toastTimeout;

  const elements = {};
  const priorityNames = { critical: "Critical", high: "High", medium: "Medium", low: "Low" };

  function cacheElements() {
    ["task-list", "empty-state", "empty-title", "empty-copy", "task-summary", "active-count", "completed-count", "overdue-count", "nav-active-count", "upcoming-list", "upcoming-empty", "task-search", "priority-filter", "status-filter", "task-modal", "task-form", "task-id", "task-title", "task-deadline", "task-priority", "modal-title", "save-task-button", "form-error", "toast"].forEach(id => {
      elements[id] = document.getElementById(id);
    });
  }

  function makeId() {
    return window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function persist() {
    const saved = window.OrbitStorage.saveTasks(tasks);
    if (!saved) showToast("Your changes could not be saved. Check your browser storage settings.");
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2600);
  }

  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }

  function formatDate(dateValue, includeTime = false) {
    const date = new Date(dateValue);
    const options = includeTime
      ? { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
      : { day: "numeric", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat(undefined, options).format(date);
  }

  function getVisibleTasks() {
    const now = Date.now();
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(filters.search);
      const matchesPriority = filters.priority === "all" || task.priority === filters.priority;
      const isOverdue = !task.completed && new Date(task.dueAt).getTime() < now;
      const matchesStatus = filters.status === "all" ||
        (filters.status === "active" && !task.completed) ||
        (filters.status === "completed" && task.completed) ||
        (filters.status === "overdue" && isOverdue);
      return matchesSearch && matchesPriority && matchesStatus;
    }).sort((a, b) => {
      if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
    });
  }

  function createTaskRow(task) {
    const row = document.createElement("div");
    const overdue = !task.completed && new Date(task.dueAt).getTime() < Date.now();
    row.className = `task-row${task.completed ? " is-completed" : ""}`;
    row.dataset.taskId = task.id;

    const nameWrap = document.createElement("div");
    nameWrap.className = "task-name-wrap";
    const check = document.createElement("button");
    check.type = "button";
    check.className = `task-check${task.completed ? " is-checked" : ""}`;
    check.dataset.action = "toggle";
    check.setAttribute("aria-label", task.completed ? "Mark task as active" : "Mark task as complete");
    check.textContent = task.completed ? "✓" : "";
    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;
    nameWrap.append(check, title);

    const priority = document.createElement("div");
    priority.className = "priority-cell";
    const pill = document.createElement("span");
    pill.className = `priority-pill priority-${task.priority}`;
    pill.textContent = priorityNames[task.priority];
    priority.append(pill);

    const deadline = document.createElement("div");
    deadline.className = "deadline-cell";
    deadline.textContent = formatDate(task.dueAt);
    const deadlineTime = document.createElement("small");
    deadlineTime.textContent = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date(task.dueAt));
    deadline.append(deadlineTime);

    const countdown = document.createElement("div");
    countdown.className = `countdown-cell${task.completed ? " is-completed" : overdue ? " is-overdue" : ""}`;
    countdown.dataset.countdown = task.id;
    countdown.textContent = task.completed ? "Completed" : window.OrbitCountdown.formatCountdown(task.dueAt);

    const actions = document.createElement("div");
    actions.className = "row-actions";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "row-menu-button";
    edit.dataset.action = "edit";
    edit.setAttribute("aria-label", `Edit ${task.title}`);
    edit.textContent = "✎";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "row-menu-button";
    remove.dataset.action = "delete";
    remove.setAttribute("aria-label", `Delete ${task.title}`);
    remove.textContent = "×";
    actions.append(edit, remove);

    row.append(nameWrap, priority, deadline, countdown, actions);
    return row;
  }

  function renderTasks() {
    const visible = getVisibleTasks();
    elements["task-list"].replaceChildren(...visible.map(createTaskRow));
    const hasTasks = visible.length > 0;
    elements["empty-state"].classList.toggle("is-visible", !hasTasks);

    if (!tasks.length) {
      elements["empty-title"].textContent = "Nothing on your list yet";
      elements["empty-copy"].textContent = "Add a task and give yourself a clear next step.";
    } else {
      elements["empty-title"].textContent = "No matching tasks";
      elements["empty-copy"].textContent = "Try changing your search or filters.";
    }

    const active = tasks.filter(task => !task.completed);
    const completed = tasks.filter(task => task.completed);
    const overdue = active.filter(task => new Date(task.dueAt).getTime() < Date.now());
    elements["active-count"].textContent = active.length;
    elements["completed-count"].textContent = completed.length;
    elements["overdue-count"].textContent = overdue.length;
    elements["nav-active-count"].textContent = active.length;
    elements["task-summary"].textContent = `${visible.length} ${visible.length === 1 ? "task" : "tasks"}`;
    renderUpcoming();
    updateCountdowns();
  }

  function renderUpcoming() {
    const upcoming = tasks.filter(task => !task.completed).sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt)).slice(0, 5);
    const list = elements["upcoming-list"];
    list.replaceChildren();
    elements["upcoming-empty"].style.display = upcoming.length ? "none" : "block";

    upcoming.forEach(task => {
      const item = document.createElement("div");
      item.className = "upcoming-item";
      const marker = document.createElement("span");
      marker.className = `upcoming-marker priority-${task.priority}`;
      const info = document.createElement("div");
      info.className = "upcoming-info";
      const title = document.createElement("div");
      title.className = "upcoming-title";
      title.textContent = task.title;
      const date = document.createElement("div");
      date.className = "upcoming-date";
      date.textContent = `${formatDate(task.dueAt)} · ${window.OrbitCountdown.formatCountdown(task.dueAt)}`;
      info.append(title, date);
      item.append(marker, info);
      list.append(item);
    });
  }

  function updateCountdowns() {
    document.querySelectorAll("[data-countdown]").forEach(element => {
      const task = tasks.find(item => item.id === element.dataset.countdown);
      if (!task || task.completed) return;
      const overdue = new Date(task.dueAt).getTime() < Date.now();
      element.textContent = window.OrbitCountdown.formatCountdown(task.dueAt);
      element.classList.toggle("is-overdue", overdue);
    });
    document.querySelectorAll(".upcoming-date").forEach((element, index) => {
      const task = tasks.filter(item => !item.completed).sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))[index];
      if (task) element.textContent = `${formatDate(task.dueAt)} · ${window.OrbitCountdown.formatCountdown(task.dueAt)}`;
    });
  }

  function openModal(task = null) {
    elements["task-form"].reset();
    elements["task-id"].value = task ? task.id : "";
    elements["task-title"].value = task ? task.title : "";
    elements["task-deadline"].value = task ? toLocalInputValue(task.dueAt) : "";
    elements["task-priority"].value = task ? task.priority : "medium";
    elements["modal-title"].textContent = task ? "Edit task" : "Create a task";
    elements["save-task-button"].textContent = task ? "Save changes" : "Create task";
    elements["form-error"].textContent = "";
    elements["task-modal"].classList.add("is-open");
    elements["task-modal"].setAttribute("aria-hidden", "false");
    window.setTimeout(() => elements["task-title"].focus(), 40);
  }

  function closeModal() {
    elements["task-modal"].classList.remove("is-open");
    elements["task-modal"].setAttribute("aria-hidden", "true");
  }

  function toLocalInputValue(dateValue) {
    const date = new Date(dateValue);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  }

  function saveTask(event) {
    event.preventDefault();
    const id = elements["task-id"].value;
    const title = elements["task-title"].value.trim();
    const deadlineValue = elements["task-deadline"].value;
    const priority = elements["task-priority"].value;
    const dueAt = new Date(deadlineValue);

    if (!title) {
      elements["form-error"].textContent = "Enter a title for your task.";
      return;
    }
    if (!deadlineValue || !Number.isFinite(dueAt.getTime())) {
      elements["form-error"].textContent = "Choose a valid deadline.";
      return;
    }
    if (!PRIORITIES.includes(priority)) {
      elements["form-error"].textContent = "Choose a valid priority.";
      return;
    }

    if (id) {
      const task = tasks.find(item => item.id === id);
      if (!task) return;
      task.title = title;
      task.dueAt = dueAt.toISOString();
      task.priority = priority;
      showToast("Task updated.");
    } else {
      tasks.push({ id: makeId(), title, dueAt: dueAt.toISOString(), priority, completed: false, createdAt: new Date().toISOString() });
      showToast("Task created.");
    }

    persist();
    renderTasks();
    closeModal();
  }

  function handleTaskAction(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const row = button.closest("[data-task-id]");
    if (!row) return;
    const task = tasks.find(item => item.id === row.dataset.taskId);
    if (!task) return;

    if (button.dataset.action === "toggle") {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : null;
      persist();
      renderTasks();
      showToast(task.completed ? "Task marked as complete." : "Task restored to active tasks.");
    }

    if (button.dataset.action === "edit") openModal(task);

    if (button.dataset.action === "delete" && window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      tasks = tasks.filter(item => item.id !== task.id);
      persist();
      renderTasks();
      showToast("Task deleted.");
    }
  }

  function setToday() {
    const now = new Date();
    const date = new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(now);
    const time = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
    document.getElementById("today-label").textContent = date;
    document.getElementById("clock-value").textContent = time;
    document.getElementById("date-value").textContent = new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long" }).format(now);
    const hour = now.getHours();
    document.getElementById("greeting").textContent = hour < 12 ? "Good morning." : hour < 18 ? "Good afternoon." : "Good evening.";
  }

  function bindEvents() {
    ["new-task-button", "panel-add-task", "sidebar-add-task", "empty-add-task"].forEach(id => document.getElementById(id).addEventListener("click", () => openModal()));
    document.getElementById("close-modal").addEventListener("click", closeModal);
    document.getElementById("cancel-modal").addEventListener("click", closeModal);
    elements["task-modal"].addEventListener("click", event => { if (event.target === elements["task-modal"]) closeModal(); });
    elements["task-form"].addEventListener("submit", saveTask);
    elements["task-list"].addEventListener("click", handleTaskAction);
    elements["task-search"].addEventListener("input", event => { filters.search = event.target.value.trim().toLowerCase(); renderTasks(); });
    elements["priority-filter"].addEventListener("change", event => { filters.priority = event.target.value; renderTasks(); });
    elements["status-filter"].addEventListener("change", event => { filters.status = event.target.value; renderTasks(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });
    document.getElementById("mobile-menu").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("is-open"));
    document.querySelector(".main-area").addEventListener("click", event => {
      if (window.innerWidth <= 650 && !event.target.closest("#mobile-menu")) document.getElementById("sidebar").classList.remove("is-open");
    });
  }

  function init() {
    cacheElements();
    bindEvents();
    setToday();
    renderTasks();
    window.setInterval(() => {
      setToday();
      updateCountdowns();
      const overdueCount = tasks.filter(task => !task.completed && new Date(task.dueAt).getTime() < Date.now()).length;
      elements["overdue-count"].textContent = overdueCount;
    }, 1000);
  }

  window.OrbitTasks = { init };
})();
