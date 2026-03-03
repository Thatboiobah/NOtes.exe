// src/Tabs.jsx
function Tabs({ activeTab, setActiveTab }) {
  return (
    <div>
      <button onClick={() => setActiveTab("lectures")}>Lectures</button>
      <button onClick={() => setActiveTab("notes")}>Notes</button>
      <button onClick={() => setActiveTab("assignments")}>Assignments</button>
      <button onClick={() => setActiveTab("exams")}>Exams</button>
    </div>
  );
}

export default Tabs;