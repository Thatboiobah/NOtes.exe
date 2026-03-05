import { useState } from "react";

const calendarStyles = `
.calender-overlay { 
  position: fixed; 
  inset: 0; 
  background: var(--bg); 
  z-index: 2000; 
  display: flex; 
  flex-direction: column; 
  padding: 30px; /* Increased padding for Brutalist breathing room */
  overflow-y: auto; 
}

/* Updated Header to align items to the bottom for a more structural look */
.cal-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-end; 
  margin-bottom: 24px; 
  padding-bottom: 16px;
  border-bottom: 4px solid var(--border);
  position: relative; 
}

.cal-title-group { display: flex; flex-direction: column; }
.cal-title-group h2 { 
  font-size: 3rem; 
  line-height: 1; 
  text-transform: uppercase; 
  margin: 0; 
  letter-spacing: -2px; 
  color: var(--text); 
}

.cal-subtitle { 
  color: var(--accent); 
  font-size: 1rem; 
  font-weight: 900; 
  text-transform: uppercase; 
  margin-bottom: 4px;
}

/* Control group with a larger gap */
.cal-controls { 
  display: flex; 
  gap: 12px; 
  align-items: center; 
}

.cal-btn { 
  background: var(--surface); 
  border: 4px solid var(--border); /* Thickened to 4px for consistency */
  color: var(--text); 
  font-family: inherit; 
  font-weight: 900; 
  font-size: 0.9rem; 
  text-transform: uppercase; 
  padding: 10px 20px; 
  cursor: pointer; 
  transition: all 0.05s; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
}

.cal-btn:hover { 
  background: var(--text); 
  color: var(--bg); 
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0px var(--border);
}

.cal-btn.icon-btn { padding: 10px; width: 44px; height: 44px; }

.cal-btn.filled { 
  background: var(--accent); 
  color: var(--accent-text); 
}

/* Removed old absolute close-btn logic as it now uses .cal-btn class */

.cal-layout { display: flex; gap: 24px; flex: 1; min-height: 0; }

.cal-grid-wrapper { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  border: 4px solid var(--border); 
  background: var(--border); 
  gap: 4px; 
}

.day-labels { 
  display: grid; 
  grid-template-columns: repeat(7, 1fr); 
  background: var(--border); 
  gap: 4px; 
}

.day-label { 
  padding: 12px; 
  text-align: center; 
  font-size: 0.85rem; 
  font-weight: 900; 
  text-transform: uppercase; 
  background: var(--surface); 
  color: var(--text); 
}

.cal-grid { 
  display: grid; 
  grid-template-columns: repeat(7, 1fr); 
  grid-auto-rows: minmax(100px, 1fr); 
  background: var(--border); 
  gap: 4px; 
  flex: 1; 
}

.cal-cell { 
  background: var(--bg); 
  padding: 12px; 
  position: relative; 
  cursor: pointer; 
  display: flex; 
  flex-direction: column; 
  gap: 6px; 
}

.cal-cell:hover { background: var(--surface); }
.cal-cell.muted { opacity: 0.3; filter: grayscale(1); }

/* Sidebar & Form adjustments */
.cal-sidebar { 
  width: 350px; 
  background: var(--surface); 
  border: 4px solid var(--border); 
  padding: 24px; 
  display: flex; 
  flex-direction: column; 
  gap: 20px; 
  overflow-y: auto; 
}

.add-event-form { 
  border-top: 4px dashed var(--border); 
  padding-top: 20px; 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
}
`;

function CalendarPanel({ isOpen, onClose, selectedDate, setSelectedDate, state, dispatch }) {
  if (!isOpen) return null;

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const prevBlanks = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    day: daysInPrevMonth - firstDayOfMonth + i + 1,
    isCurrent: false,
    isNext: false
  }));

  const currentDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    isCurrent: true,
    isNext: false
  }));

  const totalCells = prevBlanks.length + currentDays.length;
  const nextBlanksCount = totalCells > 35 ? 42 - totalCells : 35 - totalCells;
  
  const nextBlanks = Array.from({ length: nextBlanksCount }, (_, i) => ({
    day: i + 1,
    isCurrent: false,
    isNext: true
  }));

  const allCells = [...prevBlanks, ...currentDays, ...nextBlanks];

  const derivedEvents = {};

  if (state.calendarEvents) {
    Object.entries(state.calendarEvents).forEach(([date, evts]) => {
      derivedEvents[date] = evts.map(e => ({ ...e, color: "evt-blue", tag: "Manual" }));
    });
  }

  state.classes.forEach(cls => {
    cls.assignments.forEach(a => {
      if (a.dueDate) {
        if (!derivedEvents[a.dueDate]) derivedEvents[a.dueDate] = [];
        derivedEvents[a.dueDate].push({
          id: `assign-${a.id}`,
          title: `${cls.name}: ${a.title}`,
          time: "DUE",
          color: "evt-yellow",
          tag: "Assignment"
        });
      }
    });

    cls.exams.forEach(e => {
      if (e.date) {
        if (!derivedEvents[e.date]) derivedEvents[e.date] = [];
        derivedEvents[e.date].push({
          id: `exam-${e.id}`,
          title: `${cls.name}: ${e.title}`,
          time: e.time,
          color: "evt-red",
          tag: "Exam"
        });
      }
    });
  });

  const handleDateClick = (dayStr) => {
    setSelectedDate(dayStr);
    setIsSidebarOpen(true);
  };

  const changeMonth = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const addManualEvent = () => {
    if (!selectedDate || !eventTitle) return;
    dispatch({
      type: "ADD_CALENDAR_EVENT",
      payload: {
        date: selectedDate,
        event: { id: Date.now(), title: eventTitle, time: eventTime }
      }
    });
    setEventTitle("");
    setEventTime("");
  };

  const deleteManualEvent = (eventId) => {
    dispatch({
      type: "DELETE_CALENDAR_EVENT",
      payload: { date: selectedDate, id: eventId }
    });
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleString("en-US", { month: "long" });

  return (

    <div className="calender-overlay">
  <style>{calendarStyles}</style>
  
  <div className="cal-header">
    <div className="cal-title-group">
      <h2>{monthName} {currentYear}</h2>
      <span className="cal-subtitle">Schedule</span>
    </div>
    
    <div className="cal-controls">
      <button className="cal-btn icon-btn" onClick={() => changeMonth(-1)}>{"<"}</button>
      <button className="cal-btn icon-btn" onClick={() => changeMonth(1)}>{">"}</button>
      
      {/* ADD ENTRY BUTTON */}
      <button className="cal-btn filled" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? "HIDE PANEL" : "+ ADD ENTRY"}
      </button>

      {/* NEW CLOSE BUTTON POSITION */}
      <button className="cal-btn" onClick={onClose}>
        CLOSE
      </button>
    </div>
  </div>


      <div className="cal-layout">
        
        
        <div className="cal-grid-wrapper">
          <div className="day-labels">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="day-label">{d}</div>
            ))}
          </div>

          <div className="cal-grid">
            {allCells.map((cell, idx) => {
              let targetMonth = currentMonth;
              let targetYear = currentYear;
              
              if (!cell.isCurrent) {
                if (cell.isNext) {
                  targetMonth++;
                  if (targetMonth > 11) { targetMonth = 0; targetYear++; }
                } else {
                  targetMonth--;
                  if (targetMonth < 0) { targetMonth = 11; targetYear--; }
                }
              }

              const dateStr = `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
              const isSelected = dateStr === selectedDate;
              const cellEvents = derivedEvents[dateStr] || [];

              return (
                <div
                  key={`${dateStr}-${idx}`}
                  className={`cal-cell ${!cell.isCurrent ? "muted" : ""} ${isSelected ? "focus" : ""}`}
                  onClick={() => handleDateClick(dateStr)}
                >
                  <span className="day-num">{cell.day}</span>
                  {isSelected && <span className="add-indicator">+</span>}
                  
                  <div className="evt-stack">
                    {cellEvents.map(evt => (
                      <div key={evt.id} className={`evt-block ${evt.color}`}>
                        {evt.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {isSidebarOpen && (
          <div className="cal-sidebar">
            <h3>{selectedDate ? selectedDate : "SELECT A DATE"}</h3>
            
            <div className="sidebar-events">
              {selectedDate && derivedEvents[selectedDate]?.length > 0 ? (
                derivedEvents[selectedDate].map((evt) => (
                  <div key={evt.id} className="sidebar-event-item">
                    <h4>{evt.title}</h4>
                    <p>TYPE: {evt.tag} | TIME: {evt.time}</p>
                    {evt.tag === "Manual" && (
                      <button className="cal-btn" style={{ width: "100%", fontSize: "0.8rem", padding: "6px" }} onClick={() => deleteManualEvent(evt.id)}>DELETE</button>
                    )}
                  </div>
                ))
              ) : (
                <p>No events.</p>
              )}
            </div>

            <div className="add-event-form">
              <h4>ADD NEW EVENT + </h4>
              <input
                type="text"
                placeholder="EVENT TITLE"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
              <button className="cal-btn filled" style={{ width: "100%", margin: 0 }} onClick={addManualEvent}>
                ADD EVENT
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CalendarPanel;