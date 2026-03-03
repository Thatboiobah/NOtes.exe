import { useReducer, useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import Modal from "./Modal";
import NotificationPanel from "./NotificationPanel";
//import CalendarView from "./CalendarView"; 
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
  // CALENDAR STATE
  // =========================
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState({});

  // Load calendar events
  useEffect(() => {
    const saved = localStorage.getItem("calendarEvents");
    if (saved) {
      setCalendarEvents(JSON.parse(saved));
    }
  }, []);

  // Save calendar events
  useEffect(() => {
    localStorage.setItem(
      "calendarEvents",
      JSON.stringify(calendarEvents)
    );
  }, [calendarEvents]);

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
        <CalendarView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          calendarEvents={calendarEvents}
          setCalendarEvents={setCalendarEvents}
        />
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