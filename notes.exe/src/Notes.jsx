// src/Notes.jsx
function Notes({
  selectedClass,
  setIsModalOpen,
  setModalType,
  setEditingItem,
  setAppData
}) {

  const deleteNote = (id) => {
    setAppData((prev) => ({
      ...prev,
      classes: prev.classes.map((cls) =>
        cls.id === selectedClass.id
          ? {
              ...cls,
              notes: cls.notes.filter((note) => note.id !== id)
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
          setModalType("addNote");
          setIsModalOpen(true);
        }}
      >
        + Add Note
      </button>

      {selectedClass.notes.length === 0 && (
        <p>No notes yet.</p>
      )}

      {selectedClass.notes.map((note) => (
        <div key={note.id}>
          <h4>{note.title}</h4>
          <p>
            {note.content.length > 100
              ? note.content.substring(0, 100) + "..."
              : note.content}
          </p>

          <button
            onClick={() => {
              setEditingItem(note);
              setModalType("editNote");
              setIsModalOpen(true);
            }}
          >
            Edit
          </button>

          <button onClick={() => deleteNote(note.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notes;