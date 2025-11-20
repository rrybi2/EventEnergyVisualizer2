import { EventAPI } from "./eventAPI.js";
import { pickRandomWellnessActivity, motivationContent } from "./wellnessTips.js";

function renderEventOptions(select, events) {
  select.innerHTML = '<option value="" disabled selected>Choose an event…</option>';
  if (!events.length) {
    select.insertAdjacentHTML("beforeend", '<option disabled>No planned events found</option>');
    return;
  } 
  for (const ev of events) {
    const when = [ev.date, ev.time].filter(Boolean).join(" ");
    const text = when ? `${ev.name} — ${when}` : ev.name;
    console.log(ev);
    select.insertAdjacentHTML("beforeend", `<option value="${ev.id}">${text}</option>`);
  }
}

function showModal(html) {
  const box = document.getElementById("burnoutWarning");

  box.innerHTML = `
    <button class="close-btn" id="closeWarning">✕</button>
    ${html}
  `;

  box.classList.remove("hidden");

  document.getElementById("closeWarning").addEventListener("click", () => {
    box.classList.remove("show");
    setTimeout(() => { box.classList.add("hidden"); box.innerHTML = ``; }, 400);
  });

  requestAnimationFrame(() => box.classList.add("show"));
}


function showBurnoutWarning() {
  const activity = pickRandomWellnessActivity();
  showModal(`
    <h2>${activity.prompt}</h2>
    <p>${activity.text}</p>
    ${activity.instructions.length ? `<ul>${activity.instructions.map(i => `<li>${i}</li>`).join("")}</ul>` : ""}
  `);
}

function showMotivation() {
  showModal(`
    <h2>${motivationContent.prompt}</h2>
    <p>${motivationContent.text}</p>
    ${motivationContent.instructions.length ? `<ul>${motivationContent.instructions.map(i => `<li>${i}</li>`).join("")}</ul>` : ""}
  `);
}


function checkForBurnout() {
  const entries = JSON.parse(localStorage.getItem("energyEntries") || "[]");

  entries.sort((a, b) => new Date(a.dateLogged) - new Date(b.dateLogged));
  if (entries.length < 3) return;

  const last3 = entries.slice(-3);

  // make sure last 3 are negative
  const allNegative = last3.every(e => (e.energyAfter - e.energyBefore) < 0);
  if (!allNegative) return;

  // check if last 3 were logged on the same day
  const sameDate = last3.every(e => e.dateLogged.slice(0, 10) === last3[0].dateLogged.slice(0, 10));
  if (!sameDate) return;

  const t1 = new Date(last3[0].dateLogged).getTime();
  const t3 = new Date(last3[2].dateLogged).getTime();

  // check if the events were logged within a 1 hour interval
  if (t3 - t1 <= 60 * 60 * 1000) {
    //alert("You've had 3 draining events in the last hour. Take a break");
    showBurnoutWarning();
  }
}

function checkForMotivation() {
  const entries = JSON.parse(localStorage.getItem("energyEntries") || "[]");
  if (entries.length < 5) return;

  entries.sort((a, b) => new Date(a.dateLogged) - new Date(b.dateLogged));
  const last5 = entries.slice(-5);

  // make sure last 5 are all positive
  const allPositive = last5.every(e => (e.energyAfter - e.energyBefore) > 0);
  if (!allPositive) return;

  // make sure they're all logged on same day
  const sameDate = last5.every(
    e => e.dateLogged.slice(0, 10) === last5[0].dateLogged.slice(0, 10)
  );
  if (!sameDate) return;

  // must be logged within a 2 hour interval
  const t1 = new Date(last5[0].dateLogged).getTime();
  const t5 = new Date(last5[4].dateLogged).getTime();

  if (t5 - t1 <= 2 * 60 * 60 * 1000) {
    showMotivation(); 
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
  checkForBurnout();
  checkForMotivation();
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
