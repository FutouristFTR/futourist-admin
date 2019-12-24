const initialNotification = {
  message: "",
  colorClass: "info",
  iconClass: "",
  isOpen: false
};
const initialPrompt = {
  isOpen: false,
  title: "",
  text: "",
  mainAction: () => null,
  mainButton: "",
  closeAction: () => null,
  closeButton: ""
};

const initialState = {
  loading: true,
  notification: initialNotification,
  prompt: initialPrompt
};

export default function pageReducer(state, action) {
  if (state === undefined) {
    return initialState;
  }
  var newState = Object.assign({}, state);

  switch (action.type) {
    case "START_LOADER":
      newState.loading = true;
      break;

    case "STOP_LOADER":
      newState.loading = false;
      break;

    case "NOTIFICATION_show":
      newState.notification = {};
      newState.notification.message = action.message;
      newState.notification.colorClass = action.colorClass;
      newState.notification.iconClass = action.iconClass;
      newState.notification.isOpen = true;
      break;

    case "NOTIFICATION_close":
      newState.notification = initialNotification;
      break;

    case "SHOW_PROMPT": {
      newState.prompt.isOpen = true;
      newState.prompt.title = action.title;
      newState.prompt.text = action.text;
      newState.prompt.mainAction = action.mainAction;
      newState.prompt.mainButton = action.mainButton;
      newState.prompt.closeAction = action.closeAction;
      newState.prompt.closeButton = action.closeButton;
      newState.prompt = Object.assign({}, newState.prompt);

      break;
    }

    case "CLOSE_PROMPT": {
      newState.prompt.isOpen = false;
      // newState = Object.assign({}, newState);
      break;
    }

    case "RESET_STORE":
      newState = initialState;
      newState = Object.assign({}, newState);

      break;

    default:
      break;
  }
  return newState;
}
