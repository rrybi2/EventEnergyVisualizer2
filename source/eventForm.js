import { EventAPI } from "./eventAPI.js";

document.getElementById("saveEvent").addEventListener("click", () => {
  const name = document.getElementById("eventName").value.trim();
  const date = document.getElementById("eventDate").value;
  const time = document.getElementById("eventTime").value;
  const category = document.getElementById("eventCategory").value || "General";

  if (!name || !date || !time) return alert("Please fill out all fields.");

  const planned = EventAPI.getEvents();

  // Preventing duplicates by name + date + time
  if (!planned.some(e => e.name === name && e.date === date && e.time === time)) {
    EventAPI.addEvent(date, time, name, category);
  }

  document.getElementById("eventName").value = "";
  document.getElementById("eventDate").value = "";
  document.getElementById("eventTime").value = "";

  window.location.href = "../index.html"; // Navigate To Home After Submiting An Event
});
