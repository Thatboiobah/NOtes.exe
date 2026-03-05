import { useEffect } from "react";
import { generateNotifications } from "./utils/notificationEngine";

// Using a template literal for styles to keep it modular, 
// but you can move this to notification.css
const noteStyles = `
.note-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: flex-end;
  z-index: 2500;
}

.note-panel {
  width: 400px;
  height: 100%;
  background: var(--bg);
  border-left: 8px solid var(--border); /* Extra thick left border for structural feel */
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  box-shadow: -10px 0 0 rgba(0,0,0,0.2);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 4px solid var(--border);
  padding-bottom: 16px;
}

.note-header h2 {
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: -1px;
}

.note-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.note-section h3 {
  font-size: 0.9rem;
  background: var(--border);
  color: var(--bg);
  padding: 4px 8px;
  align-self: flex-start;
  text-transform: uppercase;
  font-weight: 900;
}

.note-card {
  background: var(--surface);
  border: 4px solid var(--border);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: transform 0.05s;
}

.note-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0px var(--border);
}

.note-card .title {
  font-weight: 900;
  text-transform: uppercase;
  font-size: 1.1rem;
}

.note-card .meta {
  font-size: 0.75rem;
  font-weight: bold;
  opacity: 0.7;
}

.note-card.overdue {
  border-color: #EF4444; /* Red border for urgency */
}

.note-card.overdue .title {
  color: #EF4444;
}

.empty-notes {
  border: 4px dashed var(--border);
  padding: 40px 20px;
  text-align: center;
  font-weight: 900;
  text-transform: uppercase;
  opacity: 0.5;
}
`;

function NotificationPanel({ isOpen, onClose, classes }) {
  const notifications = generateNotifications(classes);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="note-overlay" onClick={onClose}>
      <style>{noteStyles}</style>
      
      <div className="note-panel" onClick={(e) => e.stopPropagation()}>
        <div className="note-header">
          <h2>Alerts</h2>
          <button className="cal-btn" onClick={onClose}>CLOSE [X]</button>
        </div>

        <div className="note-content">
          <Section 
            title="Urgent / Overdue" 
            items={notifications.overdueAssignments} 
            type="overdue"
          />
          
          <Section 
            title="Upcoming (3 Days)" 
            items={notifications.upcomingAssignments} 
          />

          <Section 
            title="Exam Schedule (7 Days)" 
            items={notifications.upcomingExams} 
          />

          {notifications.overdueAssignments.length === 0 &&
           notifications.upcomingAssignments.length === 0 &&
           notifications.upcomingExams.length === 0 && (
             <div className="empty-notes">No Pending Alerts</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, items, type }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="note-section" style={{ marginBottom: "2rem" }}>
      <h3>{title}</h3>
      {items.map((item) => (
        <div key={item.id} className={`note-card ${type === 'overdue' ? 'overdue' : ''}`}>
          <span className="title">{item.title}</span>
          <span className="meta">{item.className.toUpperCase()} — {item.dueDate || item.date}</span>
        </div>
      ))}
    </div>
  );
}

export default NotificationPanel;