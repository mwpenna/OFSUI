import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {UserAPIService} from "../core/api/userapi.service";
import {Store} from "@ngrx/store";
import * as UserAction from '../core/redux/actions/user.actions'
import {UserState} from "../core/redux/reducers/user.reducer";

@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private router: Router, private userService: UserAPIService,
              private store: Store<UserState>) {
  }

  login(username: any, password: any) {

      this.userService.getUserToken(username, password).subscribe(
            result => {
                var token = result.json().token;
                this.store.dispatch(UserAction.updateUserToken(token));
                this.isLoggedIn = true;
                this.getAndStoreUser();
                this.router.navigate(this.redirectUrl ? [this.redirectUrl] : ['/home'])
            },
            error => {
                console.log('\n', error);
                console.log('\n', 'user credentials not valid', '\n\n');
            }
        );
  }

  logout(): void {
      console.log("Logging out");
      var now = new Date;
      var stringDate = now.getUTCFullYear() + "-" + pad(now.getUTCMonth()) + "-" + pad(now.getUTCDate()) + "T" + pad(now.getUTCHours())
                +":" + pad(now.getUTCMinutes()) + ":" + pad(now.getUTCSeconds()) + "Z";
      var updateUser = {"tokenExpDate" : stringDate};

      this.userService.updateUser(updateUser).subscribe(
          result => {
              console.log("Successfully logged out")
          },
          error => {
              console.error('\n', error);
          }
      );
      this.isLoggedIn = false;
      this.store.dispatch(UserAction.defaultUser());

      function pad(n){return n<10 ? '0'+n : n}
  }

  private getAndStoreUser(): void {
      this.userService.getUserByToken().subscribe(
          result => {
              this.store.dispatch(UserAction.update(result));
          },
          error => {
              console.error('\n', error);
          }
      );
  }
}
