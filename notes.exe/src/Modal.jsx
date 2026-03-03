// src/Modal.jsx
import { useState, useEffect } from "react";

function Modal({
  modalType,
  editingItem,
  closeModal,
  selectedClass,
  setAppData,
  addClass
}) {

  const [formData, setFormData] = useState({});

  // Pre-fill form when editing
  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({});
    }
  }, [editingItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    switch (modalType) {

      // ================= CLASS =================
      case "addClass":
        if (!formData.name) return alert("Class name required");
        addClass(formData.name);
        break;

      // ================= NOTE =================
      case "addNote":
      case "editNote":
        if (!formData.title || !formData.content)
          return alert("Title and content required");

        setAppData((prev) => ({
          ...prev,
          classes: prev.classes.map((cls) =>
            cls.id === selectedClass.id
              ? {
                  ...cls,
                  notes:
                    modalType === "addNote"
                      ? [
                          ...cls.notes,
                          {
                            id: Date.now(),
                            title: formData.title,
                            content: formData.content,
                            createdAt: new Date().toISOString()
                          }
                        ]
                      : cls.notes.map((note) =>
                          note.id === editingItem.id
                            ? { ...note, ...formData }
                            : note
                        )
                }
              : cls
          )
        }));
        break;

      // ================= ASSIGNMENT =================
      case "addAssignment":
      case "editAssignment":
        if (!formData.title || !formData.dueDate)
          return alert("Title and due date required");

        setAppData((prev) => ({
          ...prev,
          classes: prev.classes.map((cls) =>
            cls.id === selectedClass.id
              ? {
                  ...cls,
                  assignments:
                    modalType === "addAssignment"
                      ? [
                          ...cls.assignments,
                          {
                            id: Date.now(),
                            title: formData.title,
                            dueDate: formData.dueDate,
                            status: "pending"
                          }
                        ]
                      : cls.assignments.map((a) =>
                          a.id === editingItem.id
                            ? { ...a, ...formData }
                            : a
                        )
                }
              : cls
          )
        }));
        break;

      // ================= EXAM =================
      case "addExam":
      case "editExam":
        if (!formData.title || !formData.date || !formData.time || !formData.venue)
          return alert("All exam fields required");

        setAppData((prev) => ({
          ...prev,
          classes: prev.classes.map((cls) =>
            cls.id === selectedClass.id
              ? {
                  ...cls,
                  exams:
                    modalType === "addExam"
                      ? [
                          ...cls.exams,
                          {
                            id: Date.now(),
                            title: formData.title,
                            date: formData.date,
                            time: formData.time,
                            venue: formData.venue
                          }
                        ]
                      : cls.exams.map((exam) =>
                          exam.id === editingItem.id
                            ? { ...exam, ...formData }
                            : exam
                        )
                }
              : cls
          )
        }));
        break;

      default:
        break;
    }

    closeModal();
  };

  // ================= FIELD RENDERING =================
  const renderFields = () => {
    switch (modalType) {

      case "addClass":
        return (
          <>
            <input
              name="name"
              placeholder="Class Name"
              value={formData.name || ""}
              onChange={handleChange}
            />
          </>
        );

      case "addNote":
      case "editNote":
        return (
          <>
            <input
              name="title"
              placeholder="Title"
              value={formData.title || ""}
              onChange={handleChange}
            />
            <textarea
              name="content"
              placeholder="Note Content"
              value={formData.content || ""}
              onChange={handleChange}
            />
          </>
        );

      case "addAssignment":
      case "editAssignment":
        return (
          <>
            <input
              name="title"
              placeholder="Assignment Title"
              value={formData.title || ""}
              onChange={handleChange}
            />
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate || ""}
              onChange={handleChange}
            />
          </>
        );

      case "addExam":
      case "editExam":
        return (
          <>
            <input
              name="title"
              placeholder="Course Name"
              value={formData.title || ""}
              onChange={handleChange}
            />
            <input
              type="date"
              name="date"
              value={formData.date || ""}
              onChange={handleChange}
            />
            <input
              type="time"
              name="time"
              value={formData.time || ""}
              onChange={handleChange}
            />
            <input
              name="venue"
              placeholder="Venue"
              value={formData.venue || ""}
              onChange={handleChange}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {renderFields()}
        <button type="submit">Save</button>
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default Modal;