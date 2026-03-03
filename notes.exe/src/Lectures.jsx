// src/Lectures.jsx
function Lectures({
  selectedClass,
  setIsModalOpen,
  setModalType,
  setEditingItem,
  setAppData
}) {
  const deleteLecture = (id) => {
    setAppData((prev) => ({
      ...prev,
      classes: prev.classes.map((cls) =>
        cls.id === selectedClass.id
          ? {
              ...cls,
              lectures: cls.lectures.filter((lec) => lec.id !== id)
            }
          : cls
      )
    }));
  };

  return (
    <div>
      <button
        onClick={() => {
          setModalType("addLecture");
          setIsModalOpen(true);
        }}
      >
        + Add Lecture
      </button>

      {selectedClass.lectures.map((lec) => (
        <div key={lec.id}>
          <h4>{lec.topic}</h4>
          <p>{lec.datetime}</p>
          <button
            onClick={() => {
              setEditingItem(lec);
              setModalType("editLecture");
              setIsModalOpen(true);
            }}
          >
            Edit
          </button>
          <button onClick={() => deleteLecture(lec.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Lectures;