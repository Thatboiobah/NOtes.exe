function Notes({ selectedClass, setIsModalOpen, setModalType, setEditingItem, dispatch }) {

  const deleteNote = (id) => {
    dispatch({
      type: "UPDATE_CLASS",
      payload: {
        id: selectedClass.id,
        data: {
          notes: selectedClass.notes.filter(note => note.id !== id)
        }
      }
    });
  };

  return (
    <div>
      <button onClick={() => { setEditingItem(null); setModalType("addNote"); setIsModalOpen(true); }}>
        + Add Note
      </button>

      {selectedClass.notes.length === 0 && <p>No notes yet.</p>}

      {selectedClass.notes.map(note => (
        <div key={note.id}>
          <h4>{note.title}</h4>
          <p>{note.content.length > 100 ? note.content.slice(0, 100) + "..." : note.content}</p>
          <button onClick={() => { setEditingItem(note); setModalType("editNote"); setIsModalOpen(true); }}>Edit</button>
          <button onClick={() => deleteNote(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Notes;