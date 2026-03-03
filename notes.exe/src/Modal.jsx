import { useState, useEffect } from "react";

function Modal({ modalType, editingItem, closeModal, selectedClass, dispatch, addClass }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (editingItem) setFormData(editingItem);
    else setFormData({});
  }, [editingItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalType === "addClass") {
      if (!formData.name) return alert("Class name required");
      addClass(formData.name);
    }

    if (["addNote","editNote"].includes(modalType)) {
      if (!formData.title || !formData.content) return alert("Title and content required");
      const updatedNotes = modalType === "addNote"
        ? [...selectedClass.notes, { id: Date.now(), title: formData.title, content: formData.content, createdAt: new Date().toISOString() }]
        : selectedClass.notes.map(n => n.id === editingItem.id ? { ...n, ...formData } : n);
      dispatch({ type: "UPDATE_CLASS", payload: { id: selectedClass.id, data: { notes: updatedNotes } } });
    }

    if (["addAssignment","editAssignment"].includes(modalType)) {
      if (!formData.title || !formData.dueDate) return alert("Title and due date required");
      const updatedAssignments = modalType === "addAssignment"
        ? [...selectedClass.assignments, { id: Date.now(), title: formData.title, dueDate: formData.dueDate, status: "pending" }]
        : selectedClass.assignments.map(a => a.id === editingItem.id ? { ...a, ...formData } : a);
      dispatch({ type: "UPDATE_CLASS", payload: { id: selectedClass.id, data: { assignments: updatedAssignments } } });
    }

    if (["addExam","editExam"].includes(modalType)) {
      if (!formData.title || !formData.date || !formData.time || !formData.venue) return alert("All exam fields required");
      const updatedExams = modalType === "addExam"
        ? [...selectedClass.exams, { id: Date.now(), title: formData.title, date: formData.date, time: formData.time, venue: formData.venue }]
        : selectedClass.exams.map(e => e.id === editingItem.id ? { ...e, ...formData } : e);
      dispatch({ type: "UPDATE_CLASS", payload: { id: selectedClass.id, data: { exams: updatedExams } } });
    }

    closeModal();
  };

  const renderFields = () => {
    switch (modalType) {
      case "addClass": return <input name="name" placeholder="Class Name" value={formData.name || ""} onChange={handleChange} />;
      case "addNote":
      case "editNote":
        return <>
          <input name="title" placeholder="Title" value={formData.title || ""} onChange={handleChange} />
          <textarea name="content" placeholder="Content" value={formData.content || ""} onChange={handleChange} />
        </>;
      case "addAssignment":
      case "editAssignment":
        return <>
          <input name="title" placeholder="Assignment Title" value={formData.title || ""} onChange={handleChange} />
          <input type="date" name="dueDate" value={formData.dueDate || ""} onChange={handleChange} />
        </>;
      case "addExam":
      case "editExam":
        return <>
          <input name="title" placeholder="Exam Title" value={formData.title || ""} onChange={handleChange} />
          <input type="date" name="date" value={formData.date || ""} onChange={handleChange} />
          <input type="time" name="time" value={formData.time || ""} onChange={handleChange} />
          <input name="venue" placeholder="Venue" value={formData.venue || ""} onChange={handleChange} />
        </>;
      default: return null;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {renderFields()}
        <button type="submit">Save</button>
        <button type="button" onClick={closeModal}>Cancel</button>
      </form>
    </div>
  );
}

export default Modal;