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
            onClick={() => setSelectedClassId(cls.id)}
          >
            {cls.name}
          </li>
        ))}
      </ul>

      <button onClick={openAddClassModal}>+ Add Class</button>
    </aside>
  );
}

export default Sidebar;