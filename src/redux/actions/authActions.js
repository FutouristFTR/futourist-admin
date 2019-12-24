export function setAuthUser(user, dispatch) {
  dispatch({
    type: 'SET_AUTH',
    user,
  })
}
