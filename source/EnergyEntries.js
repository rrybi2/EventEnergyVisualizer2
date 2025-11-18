import { EventAPI } from "./eventAPI.js";

const list = document.getElementById("entries");
const entries = JSON.parse(localStorage.getItem("energyEntries")) || [];

const energyLabels = {
  10: "Very Low",
  30: "Low",
  50: "Medium",
  70: "High",
  90: "Very High"
};

function resolveEventName(entry) {
  if (entry.eventName) return entry.eventName;
  if (entry.event && typeof entry.event === "object" && entry.event.name) return entry.event.name;
  if (typeof entry.event === "string" && entry.event.trim()) return entry.event;

  if (entry.eventId) {
    const events = EventAPI.getEvents();
    const found = events.find(ev => ev.id === entry.eventId);
    if (found) return found.name;
  }
  return "Untitled Event";
}

function resolveLoggedDate(entry) {
  return new Date(entry.dateLogged || entry.date || Date.now()).toLocaleString();
}

function render() {
  list.innerHTML = "";
  if (!entries.length) {
    list.innerHTML = `<p class="empty">No entries yet.</p>`;
    return;
  }

  entries.slice().reverse().forEach((e, idx) => {
    // --- compute diff safely for each entry ---
    const before = Number(e.energyBefore);
    const after = Number(e.energyAfter);

    let diffDisplay = "—";
    if (Number.isFinite(before) && Number.isFinite(after)) {
      const diff = after - before;
      const diffText = diff > 0 ? "Increased" : diff < 0 ? "Decreased" : "No Change";
      diffDisplay = `${diffText} (${diff > 0 ? "+" : ""}${diff})`;
    }

    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-head">
        <h2 class="event">${resolveEventName(e)}</h2>
        <time class="time">${resolveLoggedDate(e)}</time>
      </div>
      <div class="grid">

        <p>
          <strong>Before:</strong>
          <span class="energy-badge energy-${e.energyBefore}">
            ${energyLabels[e.energyBefore]}
          </span>
        </p>

        <p>
          <strong>After:</strong>
          <span class="energy-badge energy-${e.energyAfter}">
            ${energyLabels[e.energyAfter]}
          </span>
        </p>

      </div>
      <p class="energyDif"><strong>Energy Difference:</strong> ${diffDisplay}</p>
      <p class="notes"><strong>Notes:</strong> ${e.notes || "—"}</p>
      <button class="btn small danger" data-i="${entries.length - 1 - idx}">Delete</button>
    `;
    list.appendChild(card);
  });

  // attach delete handlers
  list.querySelectorAll("button[data-i]").forEach(btn => {
    btn.addEventListener("click", (ev) => {
      const i = Number(ev.currentTarget.dataset.i);
      entries.splice(i, 1);
      localStorage.setItem("energyEntries", JSON.stringify(entries));
      render();
    });
  });
}

render();

document.getElementById("clearAll").addEventListener("click", () => {
  if (confirm("Delete all entries?")) {
    localStorage.removeItem("energyEntries");
    entries.length = 0;
    render();
  }
});
