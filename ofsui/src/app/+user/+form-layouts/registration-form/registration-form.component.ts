import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'sa-registration-form',
  templateUrl: './registration-form.component.html',
})
export class RegistrationFormComponent implements OnInit {

  public validationOptions:any = {

    // Rules for form validation
    rules: {
      username: {
        required: true
      },
      email: {
        required: true,
        email: true
      },
      password: {
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

  constructor() {
  }

  ngOnInit() {
  }

}
