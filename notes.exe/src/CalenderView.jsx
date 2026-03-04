import { useState } from "react";

const calendarStyles = `
.calender-overlay { position: fixed; inset: 0; background: var(--bg); z-index: 2000; display: flex; flex-direction: column; padding: 20px; overflow-y: auto; }
.cal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; position: relative; }
.cal-title-group { display: flex; flex-direction: column; }
.cal-title-group h2 { font-size: 2.5rem; line-height: 1; text-transform: uppercase; margin-bottom: 4px; letter-spacing: -1px; color: var(--text); }
.cal-subtitle { color: var(--accent); font-size: 0.85rem; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; }
.cal-controls { display: flex; gap: 8px; align-items: center; }
.cal-btn { background: transparent; border: 2px solid var(--border); color: var(--text); font-family: inherit; font-weight: bold; font-size: 0.85rem; text-transform: uppercase; padding: 8px 16px; cursor: pointer; transition: all 0.1s; display: flex; align-items: center; justify-content: center; }
.cal-btn:hover { background: var(--text); color: var(--bg); }
.cal-btn.icon-btn { padding: 8px; width: 36px; height: 36px; }
.cal-btn.filled { background: var(--accent); color: var(--accent-text); border-color: var(--border); }
.cal-btn.filled:hover { background: var(--text); color: var(--bg); border-color: var(--text); }
.close-btn { position: absolute; top: -20px; right: 0; background: transparent; border: none; color: var(--text); font-family: inherit; font-size: 1rem; font-weight: bold; cursor: pointer; }
.cal-layout { display: flex; gap: 24px; flex: 1; min-height: 0; }
.cal-grid-wrapper { flex: 1; display: flex; flex-direction: column; border: 2px solid var(--border); background: var(--border); gap: 2px; }
.day-labels { display: grid; grid-template-columns: repeat(7, 1fr); background: var(--border); gap: 2px; }
.day-label { padding: 8px; text-align: center; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; background: var(--bg); color: var(--text); }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: minmax(80px, 1fr); background: var(--border); gap: 2px; flex: 1; }
.cal-cell { background: var(--bg); padding: 8px; position: relative; cursor: pointer; display: flex; flex-direction: column; gap: 4px; }
.cal-cell:hover { background: var(--surface); }
.cal-cell.muted { background: var(--surface); opacity: 0.5; }
body.dark .cal-cell.muted { background: #856a00; color: #ffeb85; opacity: 1; }
.day-num { font-size: 1rem; font-weight: bold; display: block; }
.cal-cell.focus .day-num { color: var(--accent); text-decoration: underline; text-underline-offset: 4px; }
.add-indicator { position: absolute; top: 8px; right: 8px; font-size: 1rem; color: var(--accent); font-weight: bold; display: none; }
.cal-cell:hover .add-indicator, .cal-cell.focus .add-indicator { display: block; }
.evt-stack { display: flex; flex-direction: column; gap: 4px; margin-top: 4px; overflow-y: auto; }
.evt-block { font-size: 0.6rem; padding: 2px 4px; font-weight: bold; text-transform: uppercase; border: 1px solid transparent; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.evt-blue { background: #3B82F6; color: #FFF; border-color: #FFF; }
.evt-yellow { background: #FACC15; color: #111; border-color: #111; }
.evt-red { background: #EF4444; color: #FFF; border-color: #FACC15; }
.evt-green { background: #22C55E; color: #FFF; border-color: #FFF; }
.evt-purple { background: #A855F7; color: #FFF; border-color: #FFF; }
.cal-sidebar { width: 300px; background: var(--surface); border: 2px solid var(--border); padding: 24px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }
.cal-sidebar h3 { font-size: 1.5rem; text-transform: uppercase; border-bottom: 2px solid var(--border); padding-bottom: 8px; }
.sidebar-events { display: flex; flex-direction: column; gap: 12px; flex: 1; }
.sidebar-event-item { border: 2px solid var(--border); padding: 12px; background: var(--bg); }
.sidebar-event-item h4 { font-size: 1rem; text-transform: uppercase; margin-bottom: 4px; }
.sidebar-event-item p { font-size: 0.8rem; margin-bottom: 8px; font-weight: bold; opacity: 0.8; }
.add-event-form { border-top: 2px dashed var(--border); padding-top: 16px; display: flex; flex-direction: column; gap: 8px; }
`;

function CalendarPanel({ isOpen, onClose, selectedDate, setSelectedDate, state, dispatch }) {
  if (!isOpen) return null;

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Date Math ---
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
  // Ensure we always fill out complete weeks (either 35 or 42 cells total)
  const nextBlanksCount = totalCells > 35 ? 42 - totalCells : 35 - totalCells;
  
  const nextBlanks = Array.from({ length: nextBlanksCount }, (_, i) => ({
    day: i + 1,
    isCurrent: false,
    isNext: true
  }));

  const allCells = [...prevBlanks, ...currentDays, ...nextBlanks];

  // --- Smart Event Aggregator ---
  const derivedEvents = {};

  // 1. Map manual calendar events (Blue)
  if (state.calendarEvents) {
    Object.entries(state.calendarEvents).forEach(([date, evts]) => {
      derivedEvents[date] = evts.map(e => ({ ...e, color: "evt-blue", tag: "Manual" }));
    });
  }

  // 2. Map Assignments & Exams automatically
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

  // --- Handlers ---
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
      <button className="close-btn" onClick={onClose}>[X] CLOSE</button>
      
      {/* HEADER SECTION */}
      <div className="cal-header">
        <div className="cal-title-group">
          <h2>{monthName} {currentYear}</h2>
          <span className="cal-subtitle">Standard Semester Grid</span>
        </div>
        
        <div className="cal-controls">
          <button className="cal-btn icon-btn" onClick={() => changeMonth(-1)}>{"<"}</button>
          <button className="cal-btn icon-btn" onClick={() => changeMonth(1)}>{">"}</button>
          <button className="cal-btn filled" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? "HIDE PANEL" : "+ ADD ENTRY"}
          </button>
        </div>
      </div>

      <div className="cal-layout">
        
        {/* GRID SECTION */}
        <div className="cal-grid-wrapper">
          <div className="day-labels">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="day-label">{d}</div>
            ))}
          </div>

          <div className="cal-grid">
            {allCells.map((cell, idx) => {
              // Calculate correct date string based on cell type
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

        {/* SIDEBAR FOR ADDING/DELETING EVENTS */}
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
                <p>No events logged.</p>
              )}
            </div>

            <div className="add-event-form">
              <h4>+ NEW MANUAL EVENT</h4>
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