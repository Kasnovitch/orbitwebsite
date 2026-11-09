(() => {
  const STORAGE_KEY = "orbit.v1.tasks";

  function loadTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(task =>
        task &&
        typeof task.id === "string" &&
        typeof task.title === "string" &&
        typeof task.dueAt === "string" &&
        ["critical", "high", "medium", "low"].includes(task.priority) &&
        typeof task.completed === "boolean" &&
        Number.isFinite(new Date(task.dueAt).getTime())
      );
    } catch (error) {
      console.error("Orbit could not read saved tasks:", error);
      return [];
    }
  }

  function saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error("Orbit could not save tasks:", error);
      return false;
    }
  }

  window.OrbitStorage = { loadTasks, saveTasks };
})();
