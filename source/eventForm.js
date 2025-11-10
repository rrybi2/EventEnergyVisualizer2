import { EventAPI } from "./eventAPI.js";

const list = document.getElementById("eventList");

    function render() {
      list.innerHTML = "";
      const planned = EventAPI.getEvents();

      if (planned.length === 0) {
        list.innerHTML = "<li><em>No events saved</em></li>";
        return;
      }

      planned.forEach(ev => {
        const li = document.createElement("li");
        li.textContent = `${ev.name} — ${ev.date} at ${ev.time}`;
        list.appendChild(li);
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
      }

      document.getElementById("eventName").value = "";
      document.getElementById("eventDate").value = "";
      document.getElementById("eventTime").value = "";
      document.getElementById("eventCategory").value = "";
      render();
    });

    document.getElementById("clearEvents").addEventListener("click", () => {
      if (confirm("Delete all planned events?")) {
        localStorage.removeItem("plannedEvents");
        render();
      }
    });

    render();