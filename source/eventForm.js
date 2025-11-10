import { EventAPI } from "./eventAPI.js";

function renderDeleteDropdown() {
  const deleteSelect = document.getElementById("deleteEventSelect");
  if (!deleteSelect) return;
  
  const events = EventAPI.getEvents();
  // Only show incomplete events
  const incompleteEvents = events.filter(ev => !ev.isCompleted);
  
  deleteSelect.innerHTML = '<option value="" disabled selected>Select an event to delete...</option>';
  
  if (incompleteEvents.length === 0) {
    deleteSelect.innerHTML += '<option disabled>No events available</option>';
    return;
  }
  
  incompleteEvents.forEach(ev => {
    const when = [ev.date, ev.time].filter(Boolean).join(" at ");
    const text = when ? `${ev.name} — ${when}` : ev.name;
    const option = document.createElement("option");
    option.value = ev.id;
    option.textContent = text;
    deleteSelect.appendChild(option);
  });
}

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
    alert("Event created successfully!");
  } else {
    alert("This event already exists!");
  }

  document.getElementById("eventName").value = "";
  document.getElementById("eventDate").value = "";
  document.getElementById("eventTime").value = "";
  document.getElementById("eventCategory").value = "";
  
  // Refresh delete dropdown
  renderDeleteDropdown();
});

document.getElementById("deleteEvent").addEventListener("click", () => {
  const deleteSelect = document.getElementById("deleteEventSelect");
  const eventId = deleteSelect.value;
  
  if (!eventId) {
    alert("Please select an event to delete.");
    return;
  }
  
  const events = EventAPI.getEvents();
  const event = events.find(e => e.id === eventId);
  const eventName = event ? event.name : "this event";
  
  if (confirm(`Are you sure you want to delete "${eventName}"?`)) {
    const deleted = EventAPI.deleteEvent(eventId);
    if (deleted) {
      alert("Event deleted successfully!");
      renderDeleteDropdown();
    } else {
      alert("Failed to delete event.");
    }
  }
});

// Initialize dropdown on page load
renderDeleteDropdown();