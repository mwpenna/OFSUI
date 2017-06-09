import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {UserAPIService} from "../../../core/api/userapi.service";
import {XEditableService} from "../../../shared/forms/input/x-editable.service";
import {ModalDirective} from "ngx-bootstrap";
import {UserState} from "../../../core/redux/reducers/user.reducer";
import {Store} from "@ngrx/store";
import * as UserAction from '../../../core/redux/actions/user.actions'
import {AuthService} from "../../../+auth/auth.service";
import {Router} from "@angular/router";
import {HttpExceptionHandler} from "../../../core/api/httpexceptionhandler";


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
              private store: Store<UserState>, private httpExceptionHandler: HttpExceptionHandler) {
  }

  ngOnInit() {
    this.store.subscribe(
        user => {
          this.model.firstname = user.currentUser.firstname;
          this.model.lastname = user.currentUser.lastname;
          this.model.emailaddress = user.currentUser.emailaddress;
          this.model.companyname = user.currentUser.companyname;
          this.model.username = user.currentUser.username;
          this.model.role = user.currentUser.role;
          this.model.id = user.currentUser.id;
        }
    );

    this.xeditableservice.fieldChangeAnnouced$.subscribe(
        fieldChange => {
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
      var updateFirstNameRequest = {
        "firstName" : fieldChange.value
      }
      this.updateUser(updateFirstNameRequest);
    }
  }

  updateLastName(fieldChange: any) {
    if(this.isFieldChange("lastname",  fieldChange.field)) {
      var updateLastNameRequest = {
        "lastName" : fieldChange.value
      }

      this.updateUser(updateLastNameRequest);
    }
  }

  updateEmailAddress(fieldChange: any) {
    if(this.isFieldChange("emailaddress",  fieldChange.field)) {
      var updateEmailAddressRequest = {
        "emailAddress" : fieldChange.value
      }

      this.updateUser(updateEmailAddressRequest);
    }
  }

  updatePassword(fieldChange: any) {
    if(this.isFieldChange("password",  fieldChange.field)) {
      this.lgModal.show();
      this.model.password = fieldChange.value;
    }
  }

  isFieldChange(field: string, updatedField: string):boolean {
    return field==updatedField;
  }

  updateUser(request:any) {
    this.userService.updateUser(request).subscribe(
            result => {
              this.getAndStoreUser();
            },
            error => {
              this.httpExceptionHandler.handleException(error);
            }
        );
  }

  private getAndStoreUser(): void {
    this.userService.getUserByToken().subscribe(
        result => {
          this.store.dispatch(UserAction.update(result));
        },
        error => {
          this.httpExceptionHandler.handleException(error);
        }
    );
  }

  confirmPassword(event):void {
    this.lgModal.hide();

    if(this.verifyPassword == this.model.password) {
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
