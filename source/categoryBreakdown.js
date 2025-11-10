import { EventAPI } from './eventAPI.js';


// Get all Events and Filter for completed events only
const completedEntries = EventAPI.getEvents().filter(e => e.isCompleted);

// prepare entries
const entries = completedEntries.map(e => ({
    ...e,
    category: e.category || "Uncategorized",
    delta: e.points, // use points as delta 
    date: new Date(`${e.date} ${e.time}`) 
}));

function computeCategoryStats(entries) {
    const categoryStats = {};
    
    
    entries.forEach(e => {
        const cat = e.category;

        if (!categoryStats[cat]) {
            categoryStats[cat] = { sumDelta: 0, count: 0 };
        }
        
        categoryStats[cat].sumDelta += e.delta;
        categoryStats[cat].count++;
    });

    const categoryData = Object.entries(categoryStats).map(([catName, stats]) => ({
        category: catName,
        avgDelta: stats.sumDelta / stats.count,
        count: stats.count
    }));

    // Sort by average points (descending)
    categoryData.sort((a, b) => b.avgDelta - a.avgDelta);
    return categoryData;
}

function getVerdict(avgDelta) {
    if (avgDelta > 30)  return "Highly Energizing";
    if (avgDelta > 10)  return "Slightly Energizing";
    if (avgDelta < -30) return "Highly Draining";
    if (avgDelta < -10) return "Slightly Draining";
    return "Neutral";
}

function getClosestEnergyLabel(avgValue) {
    const energyLabels = [
        { label: "Very Low", value: 10 },
        { label: "Low", value: 30 },
        { label: "Medium", value: 50 },
        { label: "High", value: 70 },
        { label: "Very High", value: 90 }
    ];

    if (avgValue === null || typeof avgValue === 'undefined') {
        return "–";
    }

    const closest = energyLabels.reduce((prev, curr) => {
        const prevDiff = Math.abs(prev.value - avgValue);
        const currDiff = Math.abs(curr.value - avgValue);
        return (currDiff < prevDiff) ? curr : prev;
    });

    return closest.label;
}

const categoryData = computeCategoryStats(entries);
const noDataEl = document.getElementById("cbNoData");

if (!categoryData.length) {
    noDataEl.style.display = "block";
    document.querySelector('.cb-top').style.display = 'none';
    document.querySelector('.cb-bottom').style.display = 'none';
} else {
    const labels = categoryData.map(item => item.category);
    const deltas = categoryData.map(item => item.avgDelta);
    const barColors = categoryData.map(item =>
        item.avgDelta >= 0 ? "#d4e1b6" : "#d86755"
    );

    const ctx = document.getElementById("categoryBarChart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Average Points per Completed Event",
                data: deltas,
                backgroundColor: barColors,
                borderColor: "#0b0b0b",
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    title: { display: true, text: "Average Points (Impact)" },
                    suggestedMin: -50,
                    suggestedMax: 50,
                    ticks: {
                        callback: value => Number(value).toFixed ? Number(value).toFixed(0) : value
                    }
                },
                y: { title: { display: false } }
            }
        }
    });

    const summaryContainer = document.getElementById("categorySummary");
    summaryContainer.innerHTML = "";

    categoryData.forEach(item => {
        const verdict = getVerdict(item.avgDelta);
        //const energyLabel = getClosestEnergyLabel(item.avgDelta + 50); 

        const row = document.createElement("div");
        row.className = "legend-row";
        row.innerHTML = `
            <span>
                <strong>${item.category}</strong>: ${verdict}
                <em>(avg points: ${item.avgDelta.toFixed(1)})</em>
            </span>
        `;
        summaryContainer.appendChild(row);
    });
}
