import {User} from "../model/user.model";
import {Action} from "@ngrx/store";
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
    token: "",
    companyid: "",
    companyhref: ""
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
            case UserActions.UPDATE:
                const u: any = (<UserActions.UpdateCurrentUser>action).user;
                const currentUser: User = state.currentUser;
                currentUser.firstname = u.firstName;
                currentUser.lastname = u.lastName;
                currentUser.emailaddress = u.emailAddress;
                currentUser.companyname = u.company.name;
                currentUser.username = u.userName;
                currentUser.role = u.role;
                currentUser.id = u.id;
                currentUser.companyid = u.company.id;
                currentUser.companyhref = u.company.href;
                return {
                    currentUser: currentUser
                };
            case UserActions.DEFAULT:
                const defaultUser: User = initialUser;
                return {
                    currentUser: defaultUser
                }
            default:
                return state;
        }
    };
