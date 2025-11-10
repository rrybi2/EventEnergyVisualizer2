// Get and normalize entries from localStorage
function getEnergyEntries() {
  const raw = JSON.parse(localStorage.getItem("energyEntries") || "[]");

  return raw
    .map(e => {
      const event = e.event || {};
      let name = "Untitled Event";
      let category = "Uncategorized";
      let date = null;

      // Event name
      if (typeof event === "string") {
        name = event || "Untitled Event";
      } else if (typeof event === "object") {
        name = event.name || "Untitled Event";
      }

      // Category (optional, extendable)
      if (typeof event === "object") {
        category =
          event.category ||
          event.type ||
          event.tag ||
          "Uncategorized";
      }

      // Date: event date/time OR dateLogged
      let dateStr = null;
      if (typeof event === "object") {
        if (event.date && event.time) {
          dateStr = `${event.date}T${event.time}`;
        } else if (event.date) {
          dateStr = event.date;
        }
      }
      if (!dateStr && e.dateLogged) {
        dateStr = e.dateLogged;
      }

      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d)) {
          date = d;
        }
      }

      const before = Number(e.energyBefore ?? e.before);
      const after = Number(e.energyAfter ?? e.after);
      if (Number.isNaN(before) || Number.isNaN(after)) return null;

      const delta = after - before;

      return { name, category, date, before, after, delta };
    })
    .filter(Boolean);
}

// Overview metrics
function computeOverviewMetrics(entries) {
  if (!entries.length) {
    return {
      avgEnergy: null,
      eventsAnalyzed: 0,
      topCategory: "N/A",
    };
  }

  const eventsAnalyzed = entries.length;
  const avgEnergy =
    entries.reduce((sum, e) => sum + e.after, 0) / eventsAnalyzed;

  const perCat = {};
  entries.forEach(e => {
    const cat = e.category || "Uncategorized";
    if (!perCat[cat]) {
      perCat[cat] = { sumDelta: 0, count: 0 };
    }
    perCat[cat].sumDelta += e.delta;
    perCat[cat].count++;
  });

  let topCategory = "N/A";
  let best = -Infinity;
  Object.entries(perCat).forEach(([cat, val]) => {
    const avgDelta = val.sumDelta / val.count;
    if (avgDelta > best) {
      best = avgDelta;
      topCategory = cat;
    }
  });

  return {
    avgEnergy,
    eventsAnalyzed,
    topCategory,
  };
}

// Weekly trend (Mon–Sun, average energy AFTER)
function computeWeeklyTrend(entries) {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const sums = Array(7).fill(0);
  const counts = Array(7).fill(0);

  entries.forEach(e => {
    if (!e.date) return;
    // JS: 0=Sun..6=Sat -> 0=Mon..6=Sun
    const js = e.date.getDay();
    const idx = (js + 6) % 7;
    sums[idx] += e.after;
    counts[idx]++;
  });

  const data = sums.map((s, i) => (counts[i] ? s / counts[i] : 0));
  return { labels, data };
}
