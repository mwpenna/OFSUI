import {UserState, UserReducer} from "./reducers/user.reducer";
import {Reducer, combineReducers} from "redux";

export interface AppState {
    users: UserState
}

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
    users: UserReducer
});

export default rootReducer;