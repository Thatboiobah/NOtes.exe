// src/MainContent.jsx
import { useState } from "react";
import Modal from "./Modal";

function MainContent({ selectedClass, activeTab, setActiveTab, dispatch, setIsModalOpen, setModalType, setEditingItem }) {
  const [isAdding, setIsAdding] = useState(false);

  if (!selectedClass) return <div className="main-content">Select a class to view content.</div>;

  const tabs = ["lectures", "notes", "assignments", "exams"];
  const currentItems = selectedClass[activeTab];

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalType(`edit-${activeTab.slice(0, -1)}`); // e.g., edit-lecture
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    dispatch({ type: `DELETE_${activeTab.toUpperCase().slice(0, -1)}`, payload: { classId: selectedClass.id, id } });
  };

  const renderItemFields = (item) => {
    switch (activeTab) {
      case "lectures":
        return `${item.title} | ${item.time} | ${item.venue}`;
      case "notes":
        return `${item.title} | ${item.description}`;
      case "assignments":
        return `${item.title} | Due: ${item.dueDate}`;
      case "exams":
        return `${item.title} | ${item.date} ${item.time} | ${item.venue}`;
      default:
        return item.title;
    }
  };

  return (
    <div className="main-content">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={tab === activeTab ? "active-tab" : ""}
            onClick={() => {
              setActiveTab(tab);
              setIsAdding(false); // Fixes add form persistence bug
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <button onClick={handleAddClick}>Add {activeTab.slice(0, -1)}</button>

      {isAdding && (
        <Modal
          modalType={`add-${activeTab.slice(0, -1)}`} // add-lecture, add-note, add-assignment, add-exam
          selectedClass={selectedClass}
          dispatch={dispatch}
          closeModal={() => setIsAdding(false)}
        />
      )}

      <ul>
        {currentItems.length === 0 ? (
          <li>No {activeTab} yet.</li>
        ) : (
          currentItems.map((item) => (
            <li key={item.id}>
              {renderItemFields(item)}
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default MainContent;