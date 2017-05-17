import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: any;

  constructor(private http: Http, private location: Location) {
    this.user = {
        "username": "",
        "password" : ""
    };
  }

  ngOnInit() {
  }

  public login() {
    console.log("Username is: " + this.user.username);
    console.log("Password is: " + this.user.password);

    var encodedString = btoa(this.user.username + ":"+ this.user.password);
    console.log("Encoded Basic Auth: " + encodedString);

    let headers = new Headers({ "Authorization": "Basic "+encodedString });
    let options = new RequestOptions({ "headers": headers });
    this.http.get("http://localhost:8082/users/getToken", options)
      .subscribe(result => {
          var token = result.json().token;
          console.log("Token: "+ token);
          window.sessionStorage.setItem("token", token);
      });
  }
}
