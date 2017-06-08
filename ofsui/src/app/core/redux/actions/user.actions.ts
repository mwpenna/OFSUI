import {ActionCreator, Action} from "redux";
import {User} from "../model/user.model";
export const UPDATE: string = 'UPDATE';
export const UPDATE_TOKEN: string = 'UPDATE_TOKEN';
export const DEFAULT: string = 'DEFAULT';

export interface UpdateCurrentUser extends Action {
    user: any;
}

export interface UpdateUserToken extends Action {
    token: string;
}

export interface DefaultUser extends Action {

}

export const update: ActionCreator<UpdateCurrentUser> = (user) => ({
    type: UPDATE,
    user: user
});

export const updateUserToken: ActionCreator<UpdateUserToken> = (token) => ({
    type: UPDATE_TOKEN,
    token: token
});

export const defaultUser: ActionCreator<DefaultUser> = () => ({
    type: DEFAULT
});