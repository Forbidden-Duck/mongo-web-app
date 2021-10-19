import { combineReducers } from "redux";
import AuthReducers from "./auth/Auth.reducers";
import UserReducers from "./user/User.reducers";
// TODO Reducers

export default combineReducers({
    auth: AuthReducers,
    user: UserReducers,
});
