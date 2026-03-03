// src/utils/notificationEngine.js
export function generateNotifications(classes) {
  const now = new Date();

  const overdueAssignments = [];
  const upcomingAssignments = [];
  const upcomingExams = [];

  classes.forEach((cls) => {

    // ================= ASSIGNMENTS =================
    cls.assignments.forEach((assignment) => {
      const due = new Date(assignment.dueDate);

      if (due < now) {
        overdueAssignments.push({
          ...assignment,
          className: cls.name
        });
      } else {
        const diff = (due - now) / (1000 * 60 * 60 * 24);

        if (diff <= 3) {
          upcomingAssignments.push({
            ...assignment,
            className: cls.name
          });
        }
      }
    });

    // ================= EXAMS =================
    cls.exams.forEach((exam) => {
      const examDateTime = new Date(`${exam.date}T${exam.time}`);
      const diff = (examDateTime - now) / (1000 * 60 * 60 * 24);

      if (diff >= 0 && diff <= 7) {
        upcomingExams.push({
          ...exam,
          className: cls.name
        });
      }
    });

  });

  return {
    overdueAssignments,
    upcomingAssignments,
    upcomingExams
  };
}