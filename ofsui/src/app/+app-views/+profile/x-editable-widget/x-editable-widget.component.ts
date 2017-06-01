import {Component, OnInit, OnChanges, Input, ViewChild} from '@angular/core';
import {UserAPIService} from "../../../+home/userapi.service";
import {XEditableService} from "../../../shared/forms/input/x-editable.service";
import {Http, RequestOptions, Headers} from "@angular/http";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'x-editable-widget',
  templateUrl: './x-editable-widget.component.html',
})
export class XEditableWidgetComponent implements OnInit {

  @ViewChild('lgModal') public lgModal:ModalDirective;

  public model:any = {
    "firstname" : "",
    "lastname" : "",
    "picture": "assets/img/avatars/user-no-image.png",
    "emailaddress" : "",
    "companyname" : "",
    "username" : "",
    "role" : "",
    "id" : "",
    "password" : "****"
  };

  public verifyPassword;

  @Input()  public options = {
    mode: 'inline',
    disabled: false,
    inline: true
  };

  constructor(private userService: UserAPIService, private xeditableservice: XEditableService,
              private http: Http) {
  }

  ngOnInit() {
    this.userService.getObservableUser().subscribe(user => {
      console.log("User has been changed");
      this.model.firstname = user.firstName;
      this.model.lastname = user.lastName;
      this.model.emailaddress = user.emailAddress;
      this.model.companyname = user.company.name;
      this.model.username = user.userName;
      this.model.role = user.role;
      this.model.id = user.id;
    })

    this.xeditableservice.fieldChangeAnnouced$.subscribe(
        fieldChange => {
          console.log("Received field change");
          console.log(fieldChange);
          this.updateChangedField(fieldChange);
        }
    );
  }

  updateChangedField(fieldChange: any) {
    this.updateFirstName(fieldChange);
    this.updateLastName(fieldChange);
    this.updateEmailAddress(fieldChange);
    this.updatePassword(fieldChange);
  }

  updateFirstName(fieldChange: any) {
    if(this.isFieldChange("firstname",  fieldChange.field)) {
      console.log("FirstName is being updated");
      var updateFirstNameRequest = {
        "firstName" : fieldChange.value
      }
      this.updateUser(updateFirstNameRequest);
    }
  }

  updateLastName(fieldChange: any) {
    if(this.isFieldChange("lastname",  fieldChange.field)) {
      console.log("lastname is being updated");
      var updateLastNameRequest = {
        "lastName" : fieldChange.value
      }

      this.updateUser(updateLastNameRequest);
    }
  }

  updateEmailAddress(fieldChange: any) {
    if(this.isFieldChange("emailaddress",  fieldChange.field)) {
      console.log("emailaddress is being updated");
      var updateEmailAddressRequest = {
        "emailAddress" : fieldChange.value
      }

      this.updateUser(updateEmailAddressRequest);
    }
  }

  updatePassword(fieldChange: any) {
    if(this.isFieldChange("password",  fieldChange.field)) {
      console.log("password is being updated");
      this.lgModal.show();
      this.model.password = fieldChange.value;
    }
  }

  isFieldChange(field: string, updatedField: string):boolean {
    return field==updatedField;
  }

  onChange(){
    this.options.mode = this.options.inline ? 'inline' : 'popup';
  }

  updateUser(request:any) {
    console.log("Token: " + this.userService.getToken());
    let headers = new Headers({ "Authorization": "Bearer "+ this.userService.getToken(),
      "Content-Type" : "application/json"});
    let options = new RequestOptions({ "headers": headers });

    this.http.post("http://localhost:8082/users/id/" + this.userService.userInfo.id, JSON.stringify(request), options)
        .subscribe(
            result => {
              console.log("Successfully updatedUser")
              this.userService.updateObservableUser();
            },
            error => {
              console.error('\n', error);
            }
        );
  }

  confirmPassword(event):void {
    console.log("Confim password");
    console.log(this.verifyPassword);
    this.lgModal.hide();

    console.log("Password is: " + this.model.password);
    if(this.verifyPassword == this.model.password) {
      console.log("Password match. Updating password");
      var updatePasswordRequest = {
        "password" : this.verifyPassword
      }
      this.updateUser(updatePasswordRequest);
    }
    else {
      this.model.password = "****";
    }
  }
}
