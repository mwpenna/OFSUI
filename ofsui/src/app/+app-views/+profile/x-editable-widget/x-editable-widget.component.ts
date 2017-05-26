import {Component, OnInit, OnChanges, Input} from '@angular/core';
import {UserAPIService} from "../../../+home/userapi.service";

@Component({
  selector: 'x-editable-widget',
  templateUrl: './x-editable-widget.component.html',
})
export class XEditableWidgetComponent implements OnInit {

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

  private oldModel:any = {
    "firstname" : "",
    "lastname" : "",
    "picture": "assets/img/avatars/user-no-image.png",
    "emailaddress" : "",
    "companyname" : "",
    "username" : "",
    "role" : "",
    "id" : "",
    "password" : "****"
  }

  @Input()  public options = {
    mode: 'inline',
    disabled: false,
    inline: true
  };


  constructor(private userService: UserAPIService) {
  }

  ngOnInit() {
    this.userService.getObservableUser().subscribe(user => {
      this.model.firstname = user.firstName;
      this.model.lastname = user.lastName;
      this.model.emailaddress = user.emailAddress;
      this.model.companyname = user.company.name;
      this.model.username = user.userName;
      this.model.role = user.role;
      this.model.id = user.id;
    })
  }

  onChange(){
    this.options.mode = this.options.inline ? 'inline' : 'popup';
    if(this.isPasswordChanged()) {
      console.log("Password has been changed");
    }
  }

  isPasswordChanged():boolean {
    console.log(this.oldModel.password)
    console.log(this.model.password)
    return this.oldModel.password != this.model.password;
  }

}
