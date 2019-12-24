import { combineReducers } from "redux";
import authReducer from "redux/reducers/authReducer";
import pageReducer from "redux/reducers/pageReducer";
import collectionReducer from "redux/reducers/collectionReducer";
import databaseReducer from "redux/reducers/databaseReducer";
import projectReducer from "redux/reducers/projectReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  page: pageReducer,
  collection: collectionReducer,
  database: databaseReducer,
  project: projectReducer,
});

export default rootReducer;
