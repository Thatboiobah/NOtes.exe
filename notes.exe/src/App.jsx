import { useReducer, useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import Modal from "./Modal";
import NotificationPanel from "./NotificationPanel";
import CalenderPanel from "./CalenderView";
import { appReducer, initialState } from "./reducer/appReducer";

function App() {
  // =========================
  // REDUCER STATE
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
  // CALENDER STATE
  // =========================
  const [selectedDate, setSelectedDate] = useState(null);
  const [calenderEvents, setCalenderEvents] = useState({});
  const [isCalenderView, setIsCalenderView] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("calenderEvents");
    if (saved) {
      setCalenderEvents(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "calenderEvents",
      JSON.stringify(calenderEvents)
    );
  }, [calenderEvents]);

  // =========================
  // UI STATES
  // =========================
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [activeTab, setActiveTab] = useState("lectures");
  const [theme, setTheme] = useState("light");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const selectedClass = state.classes.find(
    (cls) => cls.id === selectedClassId
  );

  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const closeNotifications = () => {
    setIsNotificationOpen(false);
  };

  return (
    <>
      <Header
        theme={theme}
        toggleTheme={() =>
          setTheme(theme === "light" ? "dark" : "light")
        }
        onBellClick={toggleNotifications}
        toggleCalender={() =>
          setIsCalenderView((prev) => !prev)
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

      {/* Always render MainContent */}
      <MainContent
        selectedClass={selectedClass}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dispatch={dispatch}
        setIsModalOpen={setIsModalOpen}
        setModalType={setModalType}
        setEditingItem={setEditingItem}
      />

      {/* Notification Overlay */}
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={closeNotifications}
        classes={state.classes}
      />

      {/* Calender Overlay */}
      <CalenderPanel
        isOpen={isCalenderView}
        onClose={() => setIsCalenderView(false)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        events={calenderEvents}
        setEvents={setCalenderEvents}
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