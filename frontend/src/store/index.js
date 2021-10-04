import { combineReducers } from "redux";
import AuthReducers from "./auth/Auth.reducers";
// TODO Reducers

export default combineReducers({
    auth: AuthReducers,
});
