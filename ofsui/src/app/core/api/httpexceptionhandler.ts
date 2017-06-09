import {Injectable} from "@angular/core";
import {AuthService} from "../../+auth/auth.service";
import {Router} from "@angular/router";
import {UserState} from "../redux/reducers/user.reducer";
import {Store} from "@ngrx/store";
import * as UserAction from '../../core/redux/actions/user.actions'

@Injectable()
export class HttpExceptionHandler {

    constructor(private store: Store<UserState>, private authService: AuthService,
                private router: Router) {
    }

    public handleException(error: any): void {
        console.error('\n', error);

        if(error.status === 403) {
            this.handleForbiddenException();
        }
    }

    public handleForbiddenException(): void {
        window.alert("You session has expired or you have logged in from a different device with the same credentials. You will now be redirected to log back in.")
        this.store.dispatch(UserAction.defaultUser());
        this.authService.isLoggedIn = false;
        this.router.navigate(['/auth/login']);
    }
}