import {AppState} from "./app.state";
import {Reducer, Action} from "redux";

const initialState: AppState = {
    firstname : "",
    lastname : "",
    picture: "assets/img/avatars/user-no-image.png",
    emailaddress : "",
    companyname : "",
    username : "",
    role : "",
    id : ""
};

export const userReducer: Reducer<AppState> =
    (state: AppState = initialState, action: Action): AppState => {
        switch (action.type) {
            default:
                return state;
        }
    };