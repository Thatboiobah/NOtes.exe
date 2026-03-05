export const initialState = {
  classes: [],
  calendarEvents: {}, 
};

export function appReducer(state, action) {
  const { classId, data, id } = action.payload || {};

  switch (action.type) {
    case "ADD_CLASS":
      return {
        ...state,
        classes: [...state.classes, { 
          id: `cls-${Date.now()}`, 
          name: action.payload, 
          lectures: [], notes: [], assignments: [], exams: [] 
        }]
      };

    case "DELETE_CLASS":
      return { ...state, classes: state.classes.filter(c => c.id !== action.payload) };

    case "ADD_LECTURE":
    case "EDIT_LECTURE":
    case "ADD_NOTE":
    case "EDIT_NOTE":
    case "ADD_ASSIGNMENT":
    case "EDIT_ASSIGNMENT":
    case "ADD_EXAM":
    case "EDIT_EXAM": {
      const cat = action.type.split("_")[1].toLowerCase() + "s";
      return {
        ...state,
        classes: state.classes.map(cls => {
          if (cls.id !== classId) return cls;
          const items = action.type.includes("ADD") 
            ? [...cls[cat], { ...data, id: Date.now(), status: "pending" }]
            : cls[cat].map(item => item.id === data.id ? data : item);
          return { ...cls, [cat]: items };
        })
      };
    }

    case "DELETE_LECTURE":
    case "DELETE_NOTE":
    case "DELETE_ASSIGNMENT":
    case "DELETE_EXAM": {
      const cat = action.type.split("_")[1].toLowerCase() + "s";
      return {
        ...state,
        classes: state.classes.map(cls => {
          if (cls.id !== classId) return cls;
          return { ...cls, [cat]: cls[cat].filter(item => item.id !== id) };
        })
      };
    }

    case "ADD_CALENDAR_EVENT":
      const dateEvts = state.calendarEvents?.[action.payload.date] || [];
      return {
        ...state,
        calendarEvents: { 
          ...state.calendarEvents, 
          [action.payload.date]: [...dateEvts, action.payload.event] 
        }
      };

    case "DELETE_CALENDAR_EVENT":
      return {
        ...state,
        calendarEvents: {
          ...state.calendarEvents,
          [action.payload.date]: state.calendarEvents[action.payload.date].filter(e => e.id !== action.payload.id)
        }
      };

    default: return state;
  }
}