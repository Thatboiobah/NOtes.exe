import { useReducer, useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import Modal from "./Modal";
import NotificationPanel from "./NotificationPanel";
import CalendarPanel from "./CalenderView";
import { appReducer, initialState } from "./reducer/appReducer";

function App() {
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

  // UI STATES
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [activeTab, setActiveTab] = useState("lectures");
  const [theme, setTheme] = useState("light");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarView, setIsCalendarView] = useState(false);

  const selectedClass = state.classes.find(
    (cls) => cls.id === selectedClassId
  );

  const toggleNotifications = () => setIsNotificationOpen(prev => !prev);
  const closeNotifications = () => setIsNotificationOpen(false);
  const toggleCalendar = () => setIsCalendarView(prev => !prev);
  const addClass = (name) => dispatch({ type: "ADD_CLASS", payload: name });

  return (
    <>
      <Header
        theme={theme}
        toggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
        onBellClick={toggleNotifications}
        toggleCalendar={toggleCalendar} // fixed prop name
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

      <MainContent
        selectedClass={selectedClass}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dispatch={dispatch}
        setIsModalOpen={setIsModalOpen}
        setModalType={setModalType}
        setEditingItem={setEditingItem}
      />

      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={closeNotifications}
        classes={state.classes}
      />

      <CalendarPanel
        isOpen={isCalendarView}
        onClose={() => setIsCalendarView(false)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        state={state}
        dispatch={dispatch} // centralized state
      />

      {isModalOpen && (
        <Modal
          modalType={modalType}
          editingItem={editingItem}
          closeModal={() => setIsModalOpen(false)}
          selectedClass={selectedClass}
          dispatch={dispatch}
          addClass={addClass}
        />
      )}
    </>
  );
}

export default App;