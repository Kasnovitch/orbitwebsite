(() => {
  const units = [
    ["day", 86400000],
    ["hour", 3600000],
    ["minute", 60000],
    ["second", 1000]
  ];

  function getCountdown(dateValue, now = Date.now()) {
    const difference = new Date(dateValue).getTime() - now;
    const overdue = difference < 0;
    let remaining = Math.abs(difference);
    const values = {};

    for (const [name, size] of units) {
      values[name] = Math.floor(remaining / size);
      remaining %= size;
    }

    return { ...values, overdue, expired: difference === 0 };
  }

  function formatCountdown(dateValue, now = Date.now()) {
    const result = getCountdown(dateValue, now);
    const dayPart = `${result.day}d`;
    const hourPart = `${String(result.hour).padStart(2, "0")}h`;
    const minutePart = `${String(result.minute).padStart(2, "0")}m`;
    const secondPart = `${String(result.second).padStart(2, "0")}s`;
    return `${result.overdue ? "Overdue by " : ""}${dayPart} ${hourPart} ${minutePart} ${secondPart}`;
  }

  window.OrbitCountdown = { getCountdown, formatCountdown };
})();
