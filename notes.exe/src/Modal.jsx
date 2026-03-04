// src/Modal.jsx
import { useState, useEffect } from "react";

function Modal({ modalType, editingItem, closeModal, selectedClass, dispatch }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (editingItem) setFormData(editingItem);
    else setFormData({});
  }, [editingItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title && modalType !== "add-exam") return;

    const id = editingItem ? editingItem.id : Date.now();

    switch (modalType) {
      case "add-lecture":
      case "edit-lecture":
        dispatch({
          type: modalType.toUpperCase(),
          payload: { classId: selectedClass.id, data: { ...formData, id } },
        });
        break;

      case "add-note":
      case "edit-note":
        dispatch({
          type: modalType.toUpperCase(),
          payload: { classId: selectedClass.id, data: { ...formData, id } },
        });
        break;

      case "add-assignment":
      case "edit-assignment":
        dispatch({
          type: modalType.toUpperCase(),
          payload: { classId: selectedClass.id, data: { ...formData, id } },
        });
        // Add notification logic for assignment due date
        // Could push to notification panel state if implemented
        break;

      case "add-exam":
      case "edit-exam":
        dispatch({
          type: modalType.toUpperCase(),
          payload: { classId: selectedClass.id, data: { ...formData, id } },
        });
        // Add notification logic for exam date
        break;

      case "add-class":
        dispatch({ type: "ADD_CLASS", payload: formData.title });
        break;

      default:
        break;
    }

    closeModal();
  };

  // Render custom form per modalType
  const renderFormFields = () => {
    switch (modalType) {
      case "add-lecture":
      case "edit-lecture":
        return (
          <>
            <input name="title" placeholder="Title" value={formData.title || ""} onChange={handleChange} />
            <input name="time" type="time" value={formData.time || ""} onChange={handleChange} />
            <input name="venue" placeholder="Venue" value={formData.venue || ""} onChange={handleChange} />
          </>
        );
      case "add-note":
      case "edit-note":
        return (
          <>
            <input name="title" placeholder="Title" value={formData.title || ""} onChange={handleChange} />
            <textarea name="description" placeholder="Description" value={formData.description || ""} onChange={handleChange} />
          </>
        );
      case "add-assignment":
      case "edit-assignment":
        return (
          <>
            <input name="title" placeholder="Title" value={formData.title || ""} onChange={handleChange} />
            <input name="dueDate" type="date" value={formData.dueDate || ""} onChange={handleChange} />
          </>
        );
      case "add-exam":
      case "edit-exam":
        return (
          <>
            <input name="title" placeholder="Course Title" value={formData.title || ""} onChange={handleChange} />
            <input name="date" type="date" value={formData.date || ""} onChange={handleChange} />
            <input name="time" type="time" value={formData.time || ""} onChange={handleChange} />
            <input name="venue" placeholder="Venue" value={formData.venue || ""} onChange={handleChange} />
          </>
        );
      default:
        return <input name="title" placeholder="Title" value={formData.title || ""} onChange={handleChange} />;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{modalType.includes("edit") ? "Edit" : "Add"}</h2>
        {renderFormFields()}
        <button onClick={handleSubmit}>{modalType.includes("edit") ? "Save" : "Add"}</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
}

export default Modal;