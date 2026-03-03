export const initialState = {
  classes: []
};

export function appReducer(state, action) {
  switch (action.type) {
    case "ADD_CLASS":
      return {
        ...state,
        classes: [
          ...state.classes,
          {
            id: Date.now(),
            name: action.payload,
            lectures: [],
            notes: [],
            assignments: [],
            exams: []
          }
        ]
      };

    case "UPDATE_CLASS": // generic update for any class property
      return {
        ...state,
        classes: state.classes.map((cls) =>
          cls.id === action.payload.id ? { ...cls, ...action.payload.data } : cls
        )
      };

    case "DELETE_CLASS":
      return {
        ...state,
        classes: state.classes.filter((cls) => cls.id !== action.payload)
      };

    default:
      return state;
  }
}