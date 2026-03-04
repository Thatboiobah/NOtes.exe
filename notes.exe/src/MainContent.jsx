// src/MainContent.jsx
import { useState } from "react";
import Modal from "./Modal";

function MainContent({ selectedClass, activeTab, setActiveTab, dispatch, setIsModalOpen, setModalType, setEditingItem }) {
  const [isAdding, setIsAdding] = useState(false);

  // Assertive Empty State
  if (!selectedClass) {
    return (
      <div className="main-content">
        <div className="empty-state">
          Select a class to get started
        </div>
      </div>
    );
  }

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

  // Structured fields for the brutalist cards
  const renderItemFields = (item) => {
    switch (activeTab) {
      case "lectures":
        return (
          <>
            <div className="item-title">{item.title}</div>
            <div>{item.time} | {item.venue}</div>
          </>
        );
      case "notes":
        return (
          <>
            <div className="item-title">{item.title}</div>
            <div>{item.description}</div>
          </>
        );
      case "assignments":
        return (
          <>
            <div className="item-title">{item.title}</div>
            <div>Due: {item.dueDate}</div>
          </>
        );
      case "exams":
        return (
          <>
            <div className="item-title">{item.title}</div>
            <div>{item.date} @ {item.time} | {item.venue}</div>
          </>
        );
      default:
        return <div className="item-title">{item.title}</div>;
    }
  };

  return (
    <div className="main-content">
      {/* Bold Class Heading */}
      <div className="class-header">
        <span>{selectedClass.name}</span>
        <button onClick={handleAddClick}>+ ADD {activeTab.slice(0, -1).toUpperCase()}</button>
      </div>

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
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

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
          <li>No {activeTab} logged.</li>
        ) : (
          currentItems.map((item) => (
            <li key={item.id}>
              <div className="item-details">
                {renderItemFields(item)}
              </div>
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