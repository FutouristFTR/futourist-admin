const initialState = {
  user: null
}

export default function authReducer(state, action) {
  if(state === undefined) {
    return initialState;
  }
  var newState = Object.assign({}, state);

  switch(action.type) {
    case 'SET_AUTH':
      // var newComments = state.data.concat([action.comment]);
      // newState = Object.assign({}, state, {data: newComments});
      newState.user = action.user;
      break;

    case 'NOTIFICATION_close':
      newState.tc = false;
      break;

    case 'RESET_STORE':
      newState = initialState;
      break;

    default:
      break;
  }
  return newState;
}
