function Lectures({ selectedClass, setIsModalOpen, setModalType, setEditingItem, dispatch }) {

  const deleteLecture = (id) => {
    dispatch({
      type: "UPDATE_CLASS",
      payload: {
        id: selectedClass.id,
        data: {
          lectures: selectedClass.lectures.filter(l => l.id !== id)
        }
      }
    });
  };

  return (
    <div>
      <button onClick={() => { setEditingItem(null); setModalType("addLecture"); setIsModalOpen(true); }}>
        + Add Lecture
      </button>

      {selectedClass.lectures.map(l => (
        <div key={l.id}>
          <h4>{l.topic}</h4>
          <p>{l.datetime}</p>
          <button onClick={() => { setEditingItem(l); setModalType("editLecture"); setIsModalOpen(true); }}>Edit</button>
          <button onClick={() => deleteLecture(l.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Lectures;