import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import NotificationPanel from "./components/NotificationPanel";
import CalendarView from "./components/CalendarView";
import Modal from "./components/Modal";

function App() {
  const [appData, setAppData] = useState({
    username: "Sir",
    classes: []
  });

  const [selectedClassId, setSelectedClassId] = useState(null);
  const [activeTab, setActiveTab] = useState("lectures");
  const [theme, setTheme] = useState("light");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const selectedClass = appData.classes.find(
    (cls) => cls.id === selectedClassId
  );

  const addClass = (name) => {
    const newClass = {
      id: Date.now(),
      name,
      lectures: [],
      notes: [],
      assignments: [],
      exams: []
    };

    setAppData((prev) => ({
      ...prev,
      classes: [...prev.classes, newClass]
    }));
  };

  return (
    <>
      <Header
        theme={theme}
        toggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
        toggleNotifications={() =>
          setIsNotificationOpen(!isNotificationOpen)
        }
        toggleCalendar={() => setIsCalendarView(!isCalendarView)}
      />

      <Sidebar
        classes={appData.classes}
        selectedClassId={selectedClassId}
        setSelectedClassId={setSelectedClassId}
        openAddClassModal={() => {
          setModalType("addClass");
          setIsModalOpen(true);
        }}
      />

      {isCalendarView ? (
        <CalendarView appData={appData} />
      ) : (
        <MainContent
          selectedClass={selectedClass}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsModalOpen={setIsModalOpen}
          setModalType={setModalType}
          setEditingItem={setEditingItem}
          setAppData={setAppData}
        />
      )}

      {isNotificationOpen && (
        <NotificationPanel appData={appData} />
      )}

      {isModalOpen && (
        <Modal
          modalType={modalType}
          editingItem={editingItem}
          closeModal={() => setIsModalOpen(false)}
          addClass={addClass}
          selectedClass={selectedClass}
          setAppData={setAppData}
        />
      )}
    </>
  );
}

export default App;