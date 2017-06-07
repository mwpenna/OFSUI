import {User} from "../model/user.model";
import {Action} from "redux";
import { createSelector } from 'reselect';
import * as UserActions from '../actions/user.actions';

export interface UserState {
    currentUser: User;
}

const initialUser: User = {
    firstname : "",
    lastname : "",
    picture: "assets/img/avatars/user-no-image.png",
    emailaddress : "",
    companyname : "",
    username : "",
    role : "",
    id : "",
    token: ""
};

const initialState: UserState = {
  currentUser : initialUser
};

export const UserReducer =
    function (state: UserState = initialState, action: Action) : UserState {
        switch (action.type) {
            case UserActions.UPDATE_TOKEN:
                const token: string = (<UserActions.UpdateUserToken>action).token;
                const user: User = state.currentUser;
                user.token = token;
                return {
                    currentUser: user
                };
            default:
                return state;
        }
    };

export const getUsersState = (state): UserState => state.users;

export const getCurrentUser = createSelector(
    getUsersState,
    ( state: UserState ) => state.currentUser );