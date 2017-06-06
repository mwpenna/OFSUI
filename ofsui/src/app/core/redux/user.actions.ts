import {ActionCreator, Action} from "redux";
export const UPDATE: string = 'UPDATE';

export const update: ActionCreator<Action> = () => ({
    type: UPDATE
})