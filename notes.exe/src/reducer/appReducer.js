// src/reducer/appReducer.js
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

    default:
      return state;
  }
}