function Assignments({ selectedClass, setIsModalOpen, setModalType, setEditingItem, dispatch }) {

  const deleteAssignment = (id) => {
    dispatch({
      type: "UPDATE_CLASS",
      payload: {
        id: selectedClass.id,
        data: {
          assignments: selectedClass.assignments.filter(a => a.id !== id)
        }
      }
    });
  };

  const toggleStatus = (id) => {
    dispatch({
      type: "UPDATE_CLASS",
      payload: {
        id: selectedClass.id,
        data: {
          assignments: selectedClass.assignments.map(a =>
            a.id === id ? { ...a, status: a.status === "pending" ? "completed" : "pending" } : a
          )
        }
      }
    });
  };

  return (
    <div>
      <button onClick={() => { setEditingItem(null); setModalType("addAssignment"); setIsModalOpen(true); }}>
        + Add Assignment
      </button>

      {selectedClass.assignments.length === 0 && <p>No assignments yet.</p>}

      {selectedClass.assignments.map(a => (
        <div key={a.id}>
          <h4>{a.title}</h4>
          <p>Due: {a.dueDate}</p>
          <p>Status: {a.status}</p>
          {a.status === "pending" && <button onClick={() => toggleStatus(a.id)}>Mark Done</button>}
          <button onClick={() => deleteAssignment(a.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Assignments;