// src/Sidebar.jsx
function Sidebar({
  classes,
  selectedClassId,
  setSelectedClassId,
  openAddClassModal
}) {
  return (
    <aside>
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

      <button className="add-class-btn" onClick={openAddClassModal}>
        + ADD CLASS
      </button>
    </aside>
  );
}

export default Sidebar;