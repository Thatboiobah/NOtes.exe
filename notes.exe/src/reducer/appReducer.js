// src/reducer/appReducer.js
export const initialState = {
  classes: [],
  calendarEvents: {}
};

export function appReducer(state, action) {
  switch (action.type) {
    // ================= CLASS =================
    case "ADD_CLASS":
      return {
        ...state,
        classes: [
          ...state.classes,
          { id: Date.now(), name: action.payload, lectures: [], notes: [], assignments: [], exams: [] }
        ]
      };

    case "EDIT_CLASS":
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.id ? { ...cls, name: action.payload.name } : cls
        )
      };

    case "DELETE_CLASS":
      return {
        ...state,
        classes: state.classes.filter(cls => cls.id !== action.payload)
      };

    // ================= LECTURES =================
    case "ADD_LECTURE":
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.classId
            ? { ...cls, lectures: [...cls.lectures, { id: Date.now(), ...action.payload.data }] }
            : cls
        )
      };

    case "EDIT_LECTURE":
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.classId
            ? {
                ...cls,
                lectures: cls.lectures.map(lec =>
                  lec.id === action.payload.id ? { ...lec, ...action.payload.data } : lec
                )
              }
            : cls
        )
      };

    case "DELETE_LECTURE":
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.classId
            ? { ...cls, lectures: cls.lectures.filter(lec => lec.id !== action.payload.id) }
            : cls
        )
      };

    // ================= NOTES =================
    case "ADD_NOTE":
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.classId
            ? { ...cls, notes: [...cls.notes, { id: Date.now(), createdAt: new Date().toISOString(), ...action.payload.data }] }
            : cls
        )
      };

    case "EDIT_NOTE":
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.classId
            ? {
                ...cls,
                notes: cls.notes.map(note =>
                  note.id === action.payload.id ? { ...note, ...action.payload.data } : note
                )
              }
            : cls
        )
      };

    case "DELETE_NOTE":
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.classId
            ? { ...cls, notes: cls.notes.filter(note => note.id !== action.payload.id) }
            : cls
        )
      };

    // ================= ASSIGNMENTS =================
    case "ADD_ASSIGNMENT":
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.classId
            ? { ...cls, assignments: [...cls.assignments, { id: Date.now(), status: "pending", ...action.payload.data }] }
            : cls
        )
      };

    case "EDIT_ASSIGNMENT":
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.classId
            ? {
                ...cls,
                assignments: cls.assignments.map(a =>
                  a.id === action.payload.id ? { ...a, ...action.payload.data } : a
                )
              }
            : cls
        )
      };

    case "DELETE_ASSIGNMENT":
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.classId
            ? { ...cls, assignments: cls.assignments.filter(a => a.id !== action.payload.id) }
            : cls
        )
      };

    case "TOGGLE_ASSIGNMENT_STATUS":
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.classId
            ? {
                ...cls,
                assignments: cls.assignments.map(a =>
                  a.id === action.payload.id ? { ...a, status: a.status === "pending" ? "completed" : "pending" } : a
                )
              }
            : cls
        )
      };

    // ================= EXAMS =================
    case "ADD_EXAM":
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.classId
            ? { ...cls, exams: [...cls.exams, { id: Date.now(), ...action.payload.data }] }
            : cls
        )
      };

    case "EDIT_EXAM":
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.classId
            ? {
                ...cls,
                exams: cls.exams.map(exam =>
                  exam.id === action.payload.id ? { ...exam, ...action.payload.data } : exam
                )
              }
            : cls
        )
      };

    case "DELETE_EXAM":
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.classId
            ? { ...cls, exams: cls.exams.filter(exam => exam.id !== action.payload.id) }
            : cls
        )
      };

    // ================= CALENDAR EVENTS =================
    case "ADD_CALENDAR_EVENT":
      const { date, event } = action.payload;
      return {
        ...state,
        calendarEvents: {
          ...state.calendarEvents,
          [date]: [...(state.calendarEvents[date] || []), event]
        }
      };

    case "DELETE_CALENDAR_EVENT":
      return {
        ...state,
        calendarEvents: {
          ...state.calendarEvents,
          [action.payload.date]: (state.calendarEvents[action.payload.date] || []).filter(
            e => e.id !== action.payload.id
          )
        }
      };

    default:
      return state;
  }
}