import { useState, useEffect } from "react";

function Modal({ modalType, editingItem, closeModal, selectedClass, dispatch }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (editingItem) setFormData(editingItem);
    else setFormData({});
  }, [editingItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title && modalType !== "add-class") return;

    const id = editingItem ? editingItem.id : Date.now();

    if (modalType === "add-class") {
      dispatch({ type: "ADD_CLASS", payload: formData.title });
      closeModal();
      return;
    }

    dispatch({
      type: modalType.replace("-", "_").toUpperCase(),
      payload: {
        classId: selectedClass.id,
        data: { ...formData, id }
      }
    });

    closeModal();
  };

  const renderFormFields = () => {
    switch (modalType) {

      case "add-lecture":
      case "edit-lecture":
        return (
          <>
            <input name="title" placeholder="Title" value={formData.title || ""} onChange={handleChange}/>
            <input name="time" type="time" value={formData.time || ""} onChange={handleChange}/>
            <input name="venue" placeholder="Venue" value={formData.venue || ""} onChange={handleChange}/>
          </>
        );

      case "add-note":
      case "edit-note":
        return (
          <>
            <input name="title" placeholder="Title" value={formData.title || ""} onChange={handleChange}/>
            <textarea name="description" placeholder="Description" value={formData.description || ""} onChange={handleChange}/>
          </>
        );

      case "add-assignment":
      case "edit-assignment":
        return (
          <>
            <input name="title" placeholder="Title" value={formData.title || ""} onChange={handleChange}/>
            <input name="dueDate" type="date" value={formData.dueDate || ""} onChange={handleChange}/>
          </>
        );

      case "add-exam":
      case "edit-exam":
        return (
          <>
            <input name="title" placeholder="Title" value={formData.title || ""} onChange={handleChange}/>
            <input name="date" type="date" value={formData.date || ""} onChange={handleChange}/>
            <input name="time" type="time" value={formData.time || ""} onChange={handleChange}/>
            <input name="venue" placeholder="Venue" value={formData.venue || ""} onChange={handleChange}/>
          </>
        );

      default:
        return <input name="title" placeholder="Title" value={formData.title || ""} onChange={handleChange}/>;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{modalType.includes("edit") ? "Edit" : "Add"}</h2>
        {renderFormFields()}
        <button onClick={handleSubmit}>SAVE</button>
        <button onClick={closeModal}>CANCEL</button>
      </div>
    </div>
  );
}

export default Modal;