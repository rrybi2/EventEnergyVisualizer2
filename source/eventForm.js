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

// Toggle recurring options visibility
document.getElementById("recurringToggle").addEventListener("change", (e) => {
  const recurringOptions = document.getElementById("recurringOptions");
  recurringOptions.style.display = e.target.checked ? "block" : "none";
  
  // Clear recurring fields when toggled off
  if (!e.target.checked) {
    document.getElementById("recurringFrequency").value = "";
    document.getElementById("recurringEndDate").value = "";
  }
});

// Function to generate recurring dates
function generateRecurringDates(startDate, frequency, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  // Add the first occurrence
  dates.push(new Date(currentDate));
  
  while (currentDate < end) {
    switch (frequency) {
      case "daily":
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case "weekly":
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case "monthly":
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
    
    if (currentDate <= end) {
      dates.push(new Date(currentDate));
    }
  }
  
  return dates;
}

// Function to format date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

document.getElementById("saveEvent").addEventListener("click", () => {
  const name = document.getElementById("eventName").value.trim();
  const date = document.getElementById("eventDate").value;
  const time = document.getElementById("eventTime").value;
  const category = document.getElementById("eventCategory").value || "General";
  const isRecurring = document.getElementById("recurringToggle").checked;

  if (!name || !date || !time) return alert("Please fill out all fields.");

  if (isRecurring) {
    const frequency = document.getElementById("recurringFrequency").value;
    const endDate = document.getElementById("recurringEndDate").value;
    
    if (!frequency || !endDate) {
      return alert("Please select recurring frequency and end date.");
    }
    
    if (new Date(endDate) <= new Date(date)) {
      return alert("End date must be after the start date.");
    }
    
    // Generate all recurring dates
    const recurringDates = generateRecurringDates(date, frequency, endDate);
    
    let createdCount = 0;
    const planned = EventAPI.getEvents();
    
    recurringDates.forEach(recurDate => {
      const formattedDate = formatDate(recurDate);
      // Check for duplicates
      if (!planned.some(e => e.name === name && e.date === formattedDate && e.time === time)) {
        EventAPI.addEvent(formattedDate, time, name, category);
        createdCount++;
      }
    });
    
    alert(`Created ${createdCount} recurring event(s) successfully!`);
  } else {
    const planned = EventAPI.getEvents();
    
    // Preventing duplicates by name + date + time
    if (!planned.some(e => e.name === name && e.date === date && e.time === time)) {
      EventAPI.addEvent(date, time, name, category);
      alert("Event created successfully!");
    } else {
      alert("This event already exists!");
    }
  }

  // Clear form
  document.getElementById("eventName").value = "";
  document.getElementById("eventDate").value = "";
  document.getElementById("eventTime").value = "";
  document.getElementById("eventCategory").value = "";
  document.getElementById("recurringToggle").checked = false;
  document.getElementById("recurringOptions").style.display = "none";
  document.getElementById("recurringFrequency").value = "";
  document.getElementById("recurringEndDate").value = "";
  
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
