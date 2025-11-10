import { EventAPI } from './eventAPI.js'

const upcomingList = document.getElementById('upcoming-events-container');

function formatDateTime(dateStr, timeStr) {
  const dateTime = new Date(`${dateStr}T${timeStr}`);
  const options = {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return dateTime.toLocaleString('en-US', options).replace(',', '');
}

function populateUpcomingList() {
  const currentEvents = EventAPI.getEvents();
  const now = new Date();

  const upcomingEvents = currentEvents
    .map(event => ({
      ...event,
      eventDateTime: new Date(`${event.date}T${event.time}`) 
    }))
    .filter(event => event.eventDateTime > now)
    .sort((a, b) => a.eventDateTime - b.eventDateTime)
    .slice(0, 3);

  upcomingList.innerHTML = '';

  if (upcomingEvents.length === 0) {
    upcomingList.innerHTML = '<p>No Upcoming Events</p>';
    return;
  }

  upcomingEvents.forEach(event => {
    const formattedDateTime = formatDateTime(event.date, event.time);

    upcomingList.innerHTML += `
      <div class="event-card">
        <p class="event-name">${event.name}</p>
        <p class="event-time">${formattedDateTime}</p>
      </div>
    `;
  });
}

window.addEventListener('load', populateUpcomingList);