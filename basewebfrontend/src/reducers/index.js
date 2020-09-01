import { combineReducers } from "redux";
import auth from "./Auth";
import menu from "./Menu";
import error from "./Error";

export default combineReducers({
  auth,
  menu,
  error,
});
