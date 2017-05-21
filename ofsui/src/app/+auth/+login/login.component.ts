import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public username;
  public password;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  login(event){
    event.preventDefault();
    this.authService.login(this.username, this.password)
  }

}
