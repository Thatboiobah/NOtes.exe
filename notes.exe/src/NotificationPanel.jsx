import { useEffect } from "react";
import { generateNotifications } from "./utils/notificationEngine";

function NotificationPanel({ isOpen, onClose, classes }) {
  const notifications = generateNotifications(classes);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: isOpen ? "flex" : "none",
        justifyContent: "flex-end",
        zIndex: 1000,
      }}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
        }}
      />

      {/* Slide Panel */}
      <div
        style={{
          position: "relative",
          width: "350px",
          height: "100%",
          background: "white",
          padding: "1rem",
          overflowY: "auto",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <h2>Notifications</h2>

        <Section
          title="Overdue Assignments"
          items={notifications.overdueAssignments}
          renderItem={(item) => (
            <div key={`overdue-${item.id}`} style={{ marginBottom: "0.5rem" }}>
              {item.title} — {item.className}
            </div>
          )}
        />

        <Section
          title="Upcoming Assignments (3 days)"
          items={notifications.upcomingAssignments}
          renderItem={(item) => (
            <div key={`upcoming-${item.id}`} style={{ marginBottom: "0.5rem" }}>
              {item.title} — {item.className}
            </div>
          )}
        />

        <Section
          title="Upcoming Exams (7 days)"
          items={notifications.upcomingExams}
          renderItem={(item) => (
            <div key={`exam-${item.id}`} style={{ marginBottom: "0.5rem" }}>
              {item.title} — {item.className}
            </div>
          )}
        />

        {notifications.overdueAssignments.length === 0 &&
         notifications.upcomingAssignments.length === 0 &&
         notifications.upcomingExams.length === 0 && (
           <p>No notifications 🎉</p>
         )}
      </div>
    </div>
  );

  // -----------------------
  // Section Subcomponent
  // -----------------------
  function Section({ title, items, renderItem }) {
    if (!items || items.length === 0) return null;

    return (
      <div style={{ marginBottom: "1.5rem" }}>
        <h3>{title}</h3>
        {items.map(renderItem)}
      </div>
    );
  }
}

export default NotificationPanel;