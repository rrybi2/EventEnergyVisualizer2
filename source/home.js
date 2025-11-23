import { EventAPI } from './eventAPI.js'

const upcomingList = document.getElementById('upcoming-events-container');
const EVENTS_PER_PAGE = 5;
let currentPage = 1;
let upcomingEvents = [];
 
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

function updatePaginationControls() {
  const totalPages = Math.ceil(upcomingEvents.length / EVENTS_PER_PAGE);
  const paginationControls = document.getElementById('pagination-controls');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const pageInfo = document.getElementById('pageInfo');
  
  if (totalPages <= 1) {
    paginationControls.style.display = 'none';
    return;
  }
  
  paginationControls.style.display = 'block';
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  
  prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';
  prevBtn.style.cursor = currentPage === 1 ? 'not-allowed' : 'pointer';
  nextBtn.style.opacity = currentPage === totalPages ? '0.5' : '1';
  nextBtn.style.cursor = currentPage === totalPages ? 'not-allowed' : 'pointer';
}

function populateUpcomingList() {
  upcomingEvents = EventAPI.getEvents().filter(event => !event.isCompleted);
  
  upcomingList.innerHTML = '';

  if (upcomingEvents.length === 0) {
    upcomingList.innerHTML = '<p>No Upcoming Events</p>';
    document.getElementById('pagination-controls').style.display = 'none';
    return;
  }

  // Calculate start and end indices for current page
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const endIndex = Math.min(startIndex + EVENTS_PER_PAGE, upcomingEvents.length);
  const eventsToShow = upcomingEvents.slice(startIndex, endIndex);

  eventsToShow.forEach(event => {
    const formattedDateTime = formatDateTime(event.date, event.time);

    upcomingList.innerHTML += `
      <div class="event-card">
        <p class="event-name">${event.name}</p>
        <p class="event-time">${formattedDateTime}</p>
      </div>
    `;
  });
  
  updatePaginationControls();
}

// Event listeners for pagination buttons
document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    populateUpcomingList();
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  const totalPages = Math.ceil(upcomingEvents.length / EVENTS_PER_PAGE);
  if (currentPage < totalPages) {
    currentPage++;
    populateUpcomingList();
  }
});

window.addEventListener('load', populateUpcomingList);