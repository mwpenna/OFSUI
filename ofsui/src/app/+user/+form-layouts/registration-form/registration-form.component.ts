import {Component, OnInit} from '@angular/core';
import {UserAPIService} from "../../../+home/userapi.service";
import {Observable} from "rxjs";
import {RequestOptions, Headers, Http, Response} from "@angular/http";
import {Router, RouterModule, RouterLink} from "@angular/router";
import {AuthService} from "../../../+auth/auth.service";

@Component({
  selector: 'sa-registration-form',
  templateUrl: './registration-form.component.html',
})
export class RegistrationFormComponent implements OnInit {

  public validationOptions:any = {

    // Rules for form validation
    rules: {
      username1: {
        required: true
      },
      email: {
        required: true,
        email: true
      },
      password1: {
        required: true,
        minlength: 3,
        maxlength: 20
      },
      passwordConfirm: {
        required: true,
        minlength: 3,
        maxlength: 20,
        equalTo: '#password'
      },
      firstname: {
        required: false
      },
      lastname: {
        required: true
      },
      role: {
        required: true
      }
    },

    // Messages for form validation
    messages: {
      login: {
        required: 'Please enter your login'
      },
      email: {
        required: 'Please enter your email address',
        email: 'Please enter a VALID email address'
      },
      password: {
        required: 'Please enter your password'
      },
      passwordConfirm: {
        required: 'Please enter your password one more time',
        equalTo: 'Please enter the same password as above'
      },
      firstname: {
        required: 'Please select your first name'
      },
      lastname: {
        required: 'Please select your last name'
      },
      role: {
        required: 'Please select your role'
      }
    }

  };

  public user: any;

  public username1;
  public role;
  public email;
  public password1;
  public passwordConfirm;
  public firstname;
  public lastname;

  constructor(private userApi: UserAPIService, private http: Http,
              private router: Router, private authService: AuthService) {
    this.user = {
      "firstName": "",
      "lastName": "",
      "emailAddress": "",
      "password": "",
      "role": "",
      "company": {
        "name": "",
        "href": ""
      },
      "userName": ""
    }
  }

  ngOnInit() {
  }

  submit(event) {
    this.validateAllFields();
    this.setUser();
    this.createUser();
  }

  createUser():void {
    let headers = new Headers({ "Authorization": "Bearer "+ this.userApi.userInfo.token,
      "Content-Type" : "application/json"});
    let options = new RequestOptions({ "headers": headers });
    this.http.post("http://localhost:8082/users", JSON.stringify(this.user), options)
        .subscribe(
            result => {
              console.log("result status: " + result.status)
              console.log("Successfully created user")
              this.router.navigate(['/home']);
            },
            error => {
              console.error('\n', error);
            }
        );
  }

  private extractData(res:Response) {
    console.log("Response status: " + res.status);

    if(res.status == 400){
      return res.json();
    }

    return null;
  }

  private handleError(error:any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  private setUser() {
    this.user.firstName = this.firstname;
    this.user.lastName = this.lastname;
    this.user.emailAddress = this.email;
    this.user.password = this.password1;
    this.user.role = this.role;
    this.user.userName = this.username1;

    this.user.company.href = this.userApi.userInfo.company.href;
    this.user.company.name = this.userApi.userInfo.company.name;
  }

  private validateAllFields():boolean {
    if(!this.validateField(this.username1)) {
      console.error("Missing required field");
      return false;
    }

    if(!this.validateField(this.email)) {
      console.error("Missing required field");
      return false;
    }

    if(!this.validateField(this.password1)) {
      console.error("Missing required field");
      return false;
    }

    if(!this.validateField(this.passwordConfirm)) {
      console.error("Missing required field");
      return false;
    }

    if(!this.validateField(this.lastname)) {
      console.error("Missing required field");
      return false;
    }

    if(!this.validateField(this.role)) {
      console.error("Missing required field");
      return false;
    }

    return true;
  }

  private validateField(field: any):boolean {
    if(field == null || field == "") {
      return false;
    }

    return true;
  }
}
