// src/MainContent.jsx
import Tabs from "./Tabs";
import Lectures from "./Lectures";
import Notes from "./Notes";
import Assignments from "./Assignments";
import Exams from "./Exams";

function MainContent({
  selectedClass,
  activeTab,
  setActiveTab,
  setIsModalOpen,
  setModalType,
  setEditingItem,
  setAppData
}) {
  if (!selectedClass) {
    return <p>Select a class to get started</p>;
  }

  return (
    <main>
      <h2>{selectedClass.name}</h2>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "lectures" && (
        <Lectures
          selectedClass={selectedClass}
          setIsModalOpen={setIsModalOpen}
          setModalType={setModalType}
          setEditingItem={setEditingItem}
          setAppData={setAppData}
        />
      )}

      {activeTab === "notes" && (
        <Notes
          selectedClass={selectedClass}
          setIsModalOpen={setIsModalOpen}
          setModalType={setModalType}
          setEditingItem={setEditingItem}
          setAppData={setAppData}
        />
      )}

      {activeTab === "assignments" && (
        <Assignments
          selectedClass={selectedClass}
          setAppData={setAppData}
        />
      )}

      {activeTab === "exams" && (
        <Exams
          selectedClass={selectedClass}
          setIsModalOpen={setIsModalOpen}
          setModalType={setModalType}
          setEditingItem={setEditingItem}
          setAppData={setAppData}
        />
      )}
    </main>
  );
}

export default MainContent;