import { EventAPI } from "./eventAPI.js";

function renderEventOptions(select, events) {
  select.innerHTML = '<option value="" disabled selected>Choose an event…</option>';
  if (!events.length) {
    select.insertAdjacentHTML("beforeend", '<option disabled>No planned events found</option>');
    return;
  }
  for (const ev of events) {
    const when = [ev.date, ev.time].filter(Boolean).join(" ");
    const text = when ? `${ev.name} — ${when}` : ev.name;
    select.insertAdjacentHTML("beforeend", `<option value="${ev.id}">${text}</option>`);
  }
}

function loadEvents() {
  const select = document.getElementById("eventSelect");
  const events = EventAPI.getEvents();
  // Filter out completed events - only show uncompleted events
  const uncompletedEvents = events.filter(ev => !ev.isCompleted);
  renderEventOptions(select, uncompletedEvents);
}

function saveEntry(e) {
  e.preventDefault();
  const form = e.currentTarget;

  const eventId = document.getElementById("eventSelect").value;
  const events = EventAPI.getEvents();
  const ev = events.find(x => x.id === eventId) || null;

  const data = new FormData(form);
  const energyBefore = Number(data.get("energyBefore"));
  const energyAfter = Number(data.get("energyAfter"));
  
  const entry = {
    eventId,
    eventName: ev?.name ?? null,
    eventDate: ev?.date ?? null,
    eventTime: ev?.time ?? null,
    eventCategory: ev?.category ?? null,
    energyBefore,
    energyAfter,
    notes: (document.getElementById("notes").value || "").trim(),
    dateLogged: new Date().toISOString()
  };

  const entries = JSON.parse(localStorage.getItem("energyEntries") || "[]");
  entries.push(entry);
  localStorage.setItem("energyEntries", JSON.stringify(entries));

  // Mark the event as completed
  if (eventId && ev) {
    const energyDifference = energyAfter - energyBefore;
    const points = energyDifference;
    EventAPI.completeEvent(eventId, ev.time, points);
  }

  form.reset();
  document.querySelectorAll(".btn-row label").forEach(l => l.classList.remove("selected"));
  
  // Reload events to refresh the dropdown
  loadEvents();
  
  alert("Energy entry saved and event marked as complete!");
}

function initUISelections() {
  document.querySelectorAll(".btn-row").forEach(row => {
    row.addEventListener("change", () => {
      row.querySelectorAll("label").forEach(l => l.classList.remove("selected"));
      const checked = row.querySelector("input:checked");
      if (checked) row.querySelector(`label[for="${checked.id}"]`).classList.add("selected");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initUISelections();
  loadEvents();
  document.getElementById("energyForm").addEventListener("submit", saveEntry);
  console.log("LogEnergy (module) initialized");
});
