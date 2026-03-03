function Exams({ selectedClass, setIsModalOpen, setModalType, setEditingItem, dispatch }) {

  const deleteExam = (id) => {
    dispatch({
      type: "UPDATE_CLASS",
      payload: {
        id: selectedClass.id,
        data: {
          exams: selectedClass.exams.filter(e => e.id !== id)
        }
      }
    });
  };

  const sortedExams = [...selectedClass.exams].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <button onClick={() => { setEditingItem(null); setModalType("addExam"); setIsModalOpen(true); }}>
        + Add Exam
      </button>

      {sortedExams.length === 0 && <p>No upcoming exams.</p>}

      {sortedExams.map(exam => (
        <div key={exam.id}>
          <h4>{exam.title}</h4>
          <p>Date: {exam.date}</p>
          <p>Time: {exam.time}</p>
          <p>Venue: {exam.venue}</p>
          <button onClick={() => { setEditingItem(exam); setModalType("editExam"); setIsModalOpen(true); }}>Edit</button>
          <button onClick={() => deleteExam(exam.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Exams;