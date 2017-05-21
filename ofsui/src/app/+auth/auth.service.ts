import { Injectable } from '@angular/core';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {Router} from "@angular/router";

@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;

  users = {
      admin: 'aaa'
  };

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private router: Router) {

  }

  login(username: any, password: any) {
      if(username && password && this.users[username] && this.users[username]==password) {
          this.isLoggedIn = true;
          this.router.navigate(this.redirectUrl ? [this.redirectUrl] : ['/home'])

      }
      else {
          console.log('\n', 'user credentials not valid', '\n\n')
      }
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
