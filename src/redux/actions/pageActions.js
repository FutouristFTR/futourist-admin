export function startLoader(dispatch) {
  dispatch({
    type: "START_LOADER",
  });
}

export function stopLoader(dispatch) {
  dispatch({
    type: "STOP_LOADER",
  });
}

export function showNotification(message, colorClass, iconClass, dispatch) {
  dispatch({
    type: "NOTIFICATION_close",
  });
  setTimeout(() => {
    dispatch({
      type: "NOTIFICATION_show",
      message,
      colorClass,
      iconClass,
    });
  }, 200);

  setTimeout(() => {
    dispatch({
      type: "NOTIFICATION_close",
    });
  }, 4000);
}

export function closeNotification(dispatch) {
  dispatch({
    type: "NOTIFICATION_close",
  });
}

export function showPrompt(
  title,
  text,
  mainAction,
  mainButton,
  closeAction,
  closeButton,
  dispatch
) {
  dispatch({
    type: "SHOW_PROMPT",
    title,
    text,
    mainAction,
    mainButton,
    closeAction,
    closeButton,
  });
}

export function closePrompt(dispatch) {
  dispatch({
    type: "CLOSE_PROMPT",
  });
}

export function resetStore(dispatch) {
  dispatch({
    type: "RESET_STORE",
  });
}
