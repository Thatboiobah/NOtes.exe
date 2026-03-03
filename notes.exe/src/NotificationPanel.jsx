import { useState } from "react";
import "./calender.css";

function CalenderPanel({
  isOpen,
  onClose,
  selectedDate,
  setSelectedDate,
  events,
  setEvents,
}) {
  if (!isOpen) return null;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: lastDay }, (_, i) => i + 1);

  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");

  const handleDateClick = (day) => {
    const formattedDate = `${currentYear}-${String(
      currentMonth + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    setSelectedDate(formattedDate);
  };

  const addEvent = () => {
    if (!selectedDate || !eventTitle) return;

    const newEvent = {
      id: Date.now(),
      title: eventTitle,
      time: eventTime,
    };

    const updatedEvents = {
      ...events,
      [selectedDate]: [...(events[selectedDate] || []), newEvent],
    };

    setEvents(updatedEvents);
    setEventTitle("");
    setEventTime("");
  };

  return (
    <div className="calender-overlay">
      <div className="calender-panel">
        <button onClick={onClose}>Close</button>

        <h2>Calender</h2>

        <div className="calender-grid">
          {daysArray.map((day) => {
            const formattedDate = `${currentYear}-${String(
              currentMonth + 1
            ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            return (
              <div
                key={day}
                className="calender-day"
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
                <div key={event.id}>
                  {event.time} - {event.title}
                </div>
              ))
            ) : (
              <p>No events scheduled.</p>
            )}

            <input
              type="text"
              placeholder="Event Title"
              value={eventTitle}
              onChange={(e) =>
                setEventTitle(e.target.value)
              }
            />

            <input
              type="time"
              value={eventTime}
              onChange={(e) =>
                setEventTime(e.target.value)
              }
            />

            <button onClick={addEvent}>
              Add Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalenderPanel;