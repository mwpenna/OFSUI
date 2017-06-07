import {Injectable, Inject} from '@angular/core';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {Router} from "@angular/router";
import {RequestOptions, Http, Headers} from "@angular/http";
import {UserAPIService} from "../core/api/userapi.service";
import {AppStore} from "../core/redux/app.store";
import {Store} from "redux";
import {AppState} from "../core/redux/app.reducer";
import * as UserActions from '../core/redux/actions/user.actions';

@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  private updateUser : any;

  constructor(private router: Router, private http: Http,
              private userService: UserAPIService, @Inject(AppStore) private store: Store<AppState>) {
      this.updateUser = {
          "tokenExpDate": "",
      }
  }

  login(username: any, password: any) {
      this.userService.getUserToken(username, password).subscribe(
            result => {
                var token = result.json().token;
                this.userService.setToken(token);
                this.isLoggedIn = true;
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
      this.updateUser.tokenExpDate = stringDate;

      let headers = new Headers({ "Authorization": "Bearer "+ this.userService.userInfo.token,
                                  "Content-Type" : "application/json"});
      let options = new RequestOptions({ "headers": headers });

      this.http.post("http://localhost:8082/users/id/" + this.userService.userInfo.id, JSON.stringify(this.updateUser), options)
          .subscribe(
              result => {
                  console.log("Successfully logged out")
              },
              error => {
                  console.error('\n', error);
              }
          );

      window.sessionStorage.clear();
      this.isLoggedIn = false;

      function pad(n){return n<10 ? '0'+n : n}
  }
}
