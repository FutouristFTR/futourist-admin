const initialState = { projectId: null };

export default function projectReducer(state, action) {
  if (state === undefined) {
    return initialState;
  }
  var newState = Object.assign({}, state);

  switch (action.type) {
    case "SET_PROJECT_ID": {
      newState.projectId = action.projectId;
      break;
    }

    default:
      break;
  }
  return newState;
}
