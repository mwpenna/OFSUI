import {Component, OnInit} from '@angular/core';
import {LayoutService} from "../../layout/layout.service";
import {UserAPIService} from "../../../core/api/userapi.service";
import {Store} from "@ngrx/store";
import {UserState} from "../../../core/redux/reducers/user.reducer";

@Component({

  selector: 'sa-login-info',
  templateUrl: './login-info.component.html',
})
export class LoginInfoComponent implements OnInit {

  loggedInUser:any;

  constructor(
    private userService: UserAPIService, private layoutService: LayoutService, private store: Store<UserState>) {

    this.loggedInUser = {
      "name": "",
      "picture": "assets/img/avatars/user-no-image.png",
      "activity": 0
    }
  }

  ngOnInit() {
    this.store.subscribe(
        (user) => {
          this.loggedInUser.name = user.currentUser.firstname + " " + user.currentUser.lastname;
        }
    );
  }

  toggleShortcut() {
    this.layoutService.onShortcutToggle()
  }

}
