function Sidebar({
  classes,
  selectedClassId,
  setSelectedClassId,
  openAddClassModal,
  isSidebarOpen
}) {

  const clearDatabase = () => {
    if (window.confirm("ARE YOU SURE YOU WANT TO CLEAR ALL DATA?")) {
      localStorage.removeItem("studyPlannerData");
      window.location.reload();
    }
  };

  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <ul>
        {classes.map((cls) => (
          <li
            key={cls.id}
            className={cls.id === selectedClassId ? "selected" : ""}
            onClick={() => setSelectedClassId(cls.id)}
          >
            {cls.name}
          </li>
        ))}
      </ul>

      <button className="danger-btn" onClick={clearDatabase}>
        CLEAR DATABASE
      </button>

      <button className="add-class-btn" onClick={openAddClassModal}>
        + ADD CLASS
      </button>
    </aside>
  );
}

export default Sidebar;