// src/CalenderView.jsx
import { useState } from "react";
import "./calender.css";

function CalendarPanel({ isOpen, onClose, selectedDate, setSelectedDate, state, dispatch }) {
  if (!isOpen) return null;

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: lastDay }, (_, i) => i + 1);

  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");

  const events = state.calendarEvents || {};

  const handleDateClick = (day) => {
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(formattedDate);
  };

  const addEvent = () => {
    if (!selectedDate || !eventTitle) return;

    const newEvent = { id: Date.now(), title: eventTitle, time: eventTime };
    dispatch({ type: "ADD_CALENDAR_EVENT", payload: { date: selectedDate, event: newEvent } });

    setEventTitle("");
    setEventTime("");
  };

  const deleteEvent = (eventId) => {
    dispatch({ type: "DELETE_CALENDAR_EVENT", payload: { date: selectedDate, id: eventId } });
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else setCurrentMonth(prev => prev - 1);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else setCurrentMonth(prev => prev + 1);
  };

  return (
    <div className="calender-overlay">
      <div className="calender-panel">
        <button onClick={onClose}>Close</button>

        <h2>Calendar</h2>

        <div className="month-navigation">
          <button onClick={goToPrevMonth}>◀</button>
          <span>{new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}</span>
          <button onClick={goToNextMonth}>▶</button>
        </div>

        <div className="calender-grid">
          {daysArray.map((day) => {
            const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = formattedDate === today.toISOString().split("T")[0];

            return (
              <div
                key={day}
                className={`calender-day ${isToday ? "today" : ""}`}
                onClick={() => handleDateClick(day)}
              >
                {day}
                {events[formattedDate] && <span>•</span>}
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <div className="calender-events">
            <h3>Events for {selectedDate}</h3>
            {events[selectedDate]?.length > 0 ? (
              events[selectedDate].map((event) => (
                <div key={event.id} className="event-item">
                  <span>{event.time} - {event.title}</span>
                  <button onClick={() => deleteEvent(event.id)}>Delete</button>
                </div>
              ))
            ) : (
              <p>No events scheduled.</p>
            )}

            <input
              type="text"
              placeholder="Event Title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />
            <button onClick={addEvent}>Add Event</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarPanel;