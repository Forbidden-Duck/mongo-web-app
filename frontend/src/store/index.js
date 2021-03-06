import { combineReducers } from "redux";
import AuthReducers from "./auth/Auth.reducers";
import UserReducers from "./user/User.reducers";
import DBReducers from "./db/Db.reducers";
import MongoDBReducers from "./mongodb/Mongodb.reducers";

export default combineReducers({
    auth: AuthReducers,
    user: UserReducers,
    db: DBReducers,
    mongodb: MongoDBReducers,
});
