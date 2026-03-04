import { useState } from "react";
import "./calender.css";

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
                      <button onClick={() => deleteManualEvent(evt.id)}>DELETE</button>
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