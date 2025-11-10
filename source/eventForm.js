const list = document.getElementById("eventList");

    function render() {
      list.innerHTML = "";
      const planned = JSON.parse(localStorage.getItem("plannedEvents") || "[]");

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

      if (!name || !date || !time) return alert("Please fill out all fields.");

      const planned = JSON.parse(localStorage.getItem("plannedEvents") || "[]");

      // Preventing duplicates by name + date + time
      if (!planned.some(e => e.name === name && e.date === date && e.time === time)) {
        planned.push({name, date, time});
        localStorage.setItem("plannedEvents", JSON.stringify(planned));
      }

      document.getElementById("eventName").value = "";
      document.getElementById("eventDate").value = "";
      document.getElementById("eventTime").value = "";
      render();
    });

    document.getElementById("clearEvents").addEventListener("click", () => {
      if (confirm("Delete all planned events?")) {
        localStorage.removeItem("plannedEvents");
        render();
      }
    });

    render();