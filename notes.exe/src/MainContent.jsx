import { useState } from "react";
import Modal from "./Modal";

function MainContent({ selectedClass, activeTab, setActiveTab, dispatch, setIsModalOpen, setModalType, setEditingItem }) {
  const [isAdding, setIsAdding] = useState(false);

  if (!selectedClass) {
    return (
      <div className="main-content">
        <div className="empty-state">
         SELECT A CLASS TO <br /> GET STARTED!
        </div>
      </div>
    );
  }

  const tabs = ["lectures", "notes", "assignments", "exams"];
  const currentItems = selectedClass[activeTab] || [];

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalType(`edit-${activeTab.slice(0, -1)}`);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    dispatch({ 
      type: `DELETE_${activeTab.toUpperCase().slice(0, -1)}`, 
      payload: { classId: selectedClass.id, id } 
    });
  };

  const renderItemFields = (item) => {
    switch (activeTab) {
      case "lectures": return `${item.title} | ${item.time} | ${item.venue}`;
      case "notes": return `${item.title} | ${item.description?.slice(0, 30)}...`;
      case "assignments": return `${item.title} | DUE: ${item.dueDate} [${item.status}]`;
      case "exams": return `${item.title} | ${item.date} @ ${item.time}`;
      default: return item.title;
    }
  };

  return (
    <div className="main-content">
      <div className="class-header">
        <h1>{selectedClass.name}</h1>
        <button className="cal-btn filled" onClick={() => {
          setModalType(`add-${activeTab.slice(0, -1)}`);
          setIsModalOpen(true);
        }}>
          + ADD {activeTab.toUpperCase().slice(0, -1)}
        </button>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={tab === activeTab ? "active-tab" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <ul>
        {currentItems.length === 0 ? (
          <div className="empty-notes" style={{padding: '40px', border: '4px dashed var(--border)', textAlign: 'center'}}>
            NO {activeTab.toUpperCase()} ADDED YET.
          </div>
        ) : (
          currentItems.map((item) => (
            <li key={item.id} className={item.status === "completed" ? "completed-item" : ""}>
              <div className="item-details">
                <span className="item-title">{renderItemFields(item)}</span>
              </div>
              <div style={{display: 'flex', gap: '8px'}}>
                <button className="cal-btn" onClick={() => handleEdit(item)}>EDIT</button>
                <button className="cal-btn" onClick={() => handleDelete(item.id)}>DEL</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default MainContent;