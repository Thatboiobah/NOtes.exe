import { useReducer, useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import Modal from "./Modal";
import NotificationPanel from "./NotificationPanel";
import { appReducer, initialState } from "./reducer/appReducer";

function App() {

  // =========================
  // REDUCER STATE (MAIN DATA)
  // =========================
  const [state, dispatch] = useReducer(
    appReducer,
    initialState,
    (initial) => {
      try {
        const stored = localStorage.getItem("studyPlannerData");
        return stored ? JSON.parse(stored) : initial;
      } catch {
        return initial;
      }
    }
  );

  useEffect(() => {
    localStorage.setItem("studyPlannerData", JSON.stringify(state));
  }, [state]);

  // =========================
  // UI STATES
  // =========================
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [activeTab, setActiveTab] = useState("lectures");
  const [theme, setTheme] = useState("light");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // =========================
  // DERIVED DATA
  // =========================
  const selectedClass = state.classes.find(
    (cls) => cls.id === selectedClassId
  );

  // =========================
  // NOTIFICATION CONTROLS
  // =========================
  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const closeNotifications = () => {
    setIsNotificationOpen(false);
  };

  // =========================
  // RENDER
  // =========================
  return (
    <>
      <Header
        theme={theme}
        toggleTheme={() =>
          setTheme(theme === "light" ? "dark" : "light")
        }
        onBellClick={toggleNotifications}
        toggleCalendar={() =>
          setIsCalendarView((prev) => !prev)
        }
      />

      <Sidebar
        classes={state.classes}
        selectedClassId={selectedClassId}
        setSelectedClassId={setSelectedClassId}
        openAddClassModal={() => {
          setModalType("addClass");
          setIsModalOpen(true);
        }}
      />

      {isCalendarView ? (
        <CalendarView state={state} />
      ) : (
        <MainContent
          selectedClass={selectedClass}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          dispatch={dispatch}
          setIsModalOpen={setIsModalOpen}
          setModalType={setModalType}
          setEditingItem={setEditingItem}
        />
      )}

      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={closeNotifications}
        classes={state.classes}
      />

      {isModalOpen && (
        <Modal
          modalType={modalType}
          editingItem={editingItem}
          closeModal={() => setIsModalOpen(false)}
          selectedClass={selectedClass}
          dispatch={dispatch}
        />
      )}
    </>
  );
}

export default App;