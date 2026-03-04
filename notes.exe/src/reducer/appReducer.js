// src/reducer/appReducer.js
export const initialState = {
  classes: [],
  notifications: [], // NEW
};

export function appReducer(state, action) {
  switch (action.type) {
    case "ADD_CLASS":
      return {
        ...state,
        classes: [...state.classes, { id: Date.now(), title: action.payload, lectures: [], notes: [], assignments: [], exams: [] }],
      };

    case "DELETE_CLASS":
      return {
        ...state,
        classes: state.classes.filter((cls) => cls.id !== action.payload),
      };

    case "ADD_ASSIGNMENT":
    case "EDIT_ASSIGNMENT": {
      const { classId, data } = action.payload;
      const updatedClasses = state.classes.map((cls) => {
        if (cls.id !== classId) return cls;
        const assignments = action.type === "ADD_ASSIGNMENT" ? [...cls.assignments, data] : cls.assignments.map((a) => (a.id === data.id ? data : a));
        return { ...cls, assignments };
      });

      // Create a notification for due date
      const dueNotification = {
        id: Date.now(),
        type: "assignment",
        message: `Assignment "${data.title}" is due on ${data.dueDate}`,
        date: data.dueDate,
      };

      return {
        ...state,
        classes: updatedClasses,
        notifications: [...state.notifications.filter((n) => n.type !== "assignment" || n.id !== data.id), dueNotification],
      };
    }

    case "DELETE_ASSIGNMENT": {
      const { classId, id } = action.payload;
      const updatedClasses = state.classes.map((cls) => {
        if (cls.id !== classId) return cls;
        return { ...cls, assignments: cls.assignments.filter((a) => a.id !== id) };
      });
      return {
        ...state,
        classes: updatedClasses,
        notifications: state.notifications.filter((n) => n.type !== "assignment" || n.id !== id),
      };
    }

    case "ADD_EXAM":
    case "EDIT_EXAM": {
      const { classId, data } = action.payload;
      const updatedClasses = state.classes.map((cls) => {
        if (cls.id !== classId) return cls;
        const exams = action.type === "ADD_EXAM" ? [...cls.exams, data] : cls.exams.map((e) => (e.id === data.id ? data : e));
        return { ...cls, exams };
      });

      // Create a notification for exam
      const examNotification = {
        id: Date.now(),
        type: "exam",
        message: `Exam "${data.title}" is scheduled for ${data.date} at ${data.time}`,
        date: data.date,
      };

      return {
        ...state,
        classes: updatedClasses,
        notifications: [...state.notifications.filter((n) => n.type !== "exam" || n.id !== data.id), examNotification],
      };
    }

    case "DELETE_EXAM": {
      const { classId, id } = action.payload;
      const updatedClasses = state.classes.map((cls) => {
        if (cls.id !== classId) return cls;
        return { ...cls, exams: cls.exams.filter((e) => e.id !== id) };
      });
      return {
        ...state,
        classes: updatedClasses,
        notifications: state.notifications.filter((n) => n.type !== "exam" || n.id !== id),
      };
    }

    default:
      return state;
  }
}