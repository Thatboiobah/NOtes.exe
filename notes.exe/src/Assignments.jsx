function Assignments({
  selectedClass,
  setIsModalOpen,
  setModalType,
  setEditingItem,
  setAppData
}) {

  const deleteAssignment = (id) => {
    setAppData((prev) => ({
      ...prev,
      classes: prev.classes.map((cls) =>
        cls.id === selectedClass.id
          ? {
              ...cls,
              assignments: cls.assignments.filter((a) => a.id !== id)
            }
          : cls
      )
    }));
  };

  const toggleStatus = (id) => {
    setAppData((prev) => ({
      ...prev,
      classes: prev.classes.map((cls) =>
        cls.id === selectedClass.id
          ? {
              ...cls,
              assignments: cls.assignments.map((a) =>
                a.id === id
                  ? {
                      ...a,
                      status:
                        a.status === "pending"
                          ? "completed"
                          : "pending"
                    }
                  : a
              )
            }
          : cls
      )
    }));
  };

  return (
    <div>
      <button
        onClick={() => {
          setEditingItem(null);
          setModalType("addAssignment");
          setIsModalOpen(true);
        }}
      >
        + Add Assignment
      </button>

      {selectedClass.assignments.length === 0 && (
        <p>No assignments yet.</p>
      )}

      {selectedClass.assignments.map((assignment) => (
        <div key={assignment.id}>
          <h4>{assignment.title}</h4>
          <p>Due: {assignment.dueDate}</p>
          <p>Status: {assignment.status}</p>

          {assignment.status === "pending" && (
            <button onClick={() => toggleStatus(assignment.id)}>
              Mark Done
            </button>
          )}

          <button onClick={() => deleteAssignment(assignment.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Assignments;