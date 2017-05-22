import {Component, OnInit} from '@angular/core';
import {LayoutService} from "../../layout/layout.service";
import {UserAPIService} from "../../../+home/userapi.service";

@Component({

  selector: 'sa-login-info',
  templateUrl: './login-info.component.html',
})
export class LoginInfoComponent implements OnInit {

  loggedInUser:any;

  constructor(
    private userService: UserAPIService,
              private layoutService: LayoutService) {

    this.loggedInUser = {
      "username": "",
      "picture": "assets/img/avatars/user-no-image.png",
      "activity": 0
    }
  }

  ngOnInit() {
    this.userService.getObservableUser().subscribe(user => {
      this.loggedInUser.username = user.userName;
    })
  }

  toggleShortcut() {
    this.layoutService.onShortcutToggle()
  }

}
