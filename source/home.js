import { EventAPI } from './eventAPI.js'

const upcomingList = document.getElementById('upcoming-events-container');
const EVENTS_PER_PAGE = 3;
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
    paginationControls.classList.remove('show');
    return;
  }
  
  paginationControls.classList.add('show');
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

function populateUpcomingList() {
  upcomingEvents = EventAPI.getEvents().filter(event => !event.isCompleted);
  
  upcomingList.innerHTML = '';

  if (upcomingEvents.length === 0) {
    upcomingList.innerHTML = '<p>No Upcoming Events</p>';
    document.getElementById('pagination-controls').classList.remove('show');
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

function createTrendChart() {
  const canvas = document.getElementById('trendChart');
  const noDataMsg = document.getElementById('noTrendsData');
  
  if (!canvas) return;
  
  const completedEvents = EventAPI.getEvents().filter(e => e.isCompleted);
  
  if (completedEvents.length === 0) {
    canvas.style.display = 'none';
    noDataMsg.style.display = 'block';
    return;
  }

  const entries = completedEvents.map(e => ({
    date: new Date(`${e.date} ${e.time}`),
    points: e.points
  }));
  
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const sums = Array(7).fill(0);
  const counts = Array(7).fill(0);
  
  entries.forEach(e => {
    if (!e.date || isNaN(e.date)) return;
    const jsDay = e.date.getDay();
    const idx = (jsDay + 6) % 7; 
    sums[idx] += e.points;
    counts[idx]++;
  });
  
  const data = sums.map((s, i) => (counts[i] ? s / counts[i] : 0));
  
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Avg Points Impact per Day',
        data,
        borderColor: '#d64b3b',
        backgroundColor: 'rgba(214,75,59,0.12)',
        borderWidth: 3,
        tension: 0.25,
        pointRadius: 4,
        pointBackgroundColor: '#d64b3b',
        pointBorderColor: '#0b0b0b',
        pointBorderWidth: 1.5,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMin: -50,
          suggestedMax: 50,
          ticks: { stepSize: 10 },
          title: {
            display: true,
            text: 'Average Points (Impact)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Day of Week'
          }
        }
      }
    }
  });
}

window.addEventListener('load', () => {
  populateUpcomingList();
  createTrendChart();
});

let currentTutorialStep = 0;
const totalTutorialSteps = 7;

window.showGuide = function() {
  currentTutorialStep = 0;
  document.getElementById('tutorialModal').classList.remove('hidden');
  updateTutorialStep();
}

window.closeTutorial = function() {
  document.getElementById('tutorialModal').classList.add('hidden');
}

window.nextStep = function() {
  if (currentTutorialStep < totalTutorialSteps - 1) {
    currentTutorialStep++;
    updateTutorialStep();
  }
}

window.prevStep = function() {
  if (currentTutorialStep > 0) {
    currentTutorialStep--;
    updateTutorialStep();
  }
}

function updateTutorialStep() {
  for (let i = 0; i < totalTutorialSteps; i++) {
    const step = document.getElementById(`step-${i}`);
    if (step) step.style.display = 'none';
  }
  
  const currentStep = document.getElementById(`step-${currentTutorialStep}`);
  if (currentStep) currentStep.style.display = 'block';
  
  document.getElementById('stepCounter').textContent = `${currentTutorialStep + 1} of ${totalTutorialSteps}`;
  
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (prevBtn) {
    if (currentTutorialStep === 0) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'block';
    }
  }
  
  if (nextBtn) {
    if (currentTutorialStep === totalTutorialSteps - 1) {
      nextBtn.textContent = 'Close';
      nextBtn.onclick = closeTutorial;
    } else {
      nextBtn.textContent = 'Next →';
      nextBtn.onclick = nextStep;
    }
  }
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('tutorialModal');
  if (modal && e.target === modal) {
    closeTutorial();
  }
});