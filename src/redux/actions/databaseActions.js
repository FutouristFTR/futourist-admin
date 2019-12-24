export function markLoadedAll(collectionName, dispatch) {
  dispatch({
    type: "MARK_LOADED_ALL",
    collectionName,
  });
}
