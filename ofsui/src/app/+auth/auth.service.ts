import { Injectable } from '@angular/core';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {Router} from "@angular/router";
import {RequestOptions, Http, Headers} from "@angular/http";

@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private router: Router, private http: Http) {

  }

  login(username: any, password: any) {
      console.log("Username is: " + username);
      console.log("Password is: " + password);

      var encodedString = btoa(username + ":"+ password);
      console.log("Encoded Basic Auth: " + encodedString);

      let headers = new Headers({ "Authorization": "Basic "+encodedString });
      let options = new RequestOptions({ "headers": headers });
      this.http.get("http://localhost:8082/users/getToken", options)
        .subscribe(result => {
            var token = result.json().token;
            console.log("Token: "+ token);
            window.sessionStorage.setItem("token", token);
            this.isLoggedIn = true;
            this.router.navigate(this.redirectUrl ? [this.redirectUrl] : ['/home'])
        },
        error => {
            console.log('\n', error);
            console.log('\n', 'user credentials not valid', '\n\n');
        });
      }

  logout(): void {
    console.log("Logging out");
    window.sessionStorage.clear();
    this.isLoggedIn = false;
  }
}
