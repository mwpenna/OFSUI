import {Component, OnInit} from '@angular/core';
import {UserState} from "../../../core/redux/reducers/user.reducer";
import {Store} from "@ngrx/store";

@Component({

  selector: 'sa-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {

  public isAdmin: boolean = false;
  public isAccountManager: boolean = false;

  constructor(private store: Store<UserState>) {
  }

  ngOnInit() {
    this.store.subscribe(
        (u) => {
          if(u.currentUser.role == 'ADMIN') {
              this.isAdmin = true;
          }
          else if(u.currentUser.role == 'ACCOUNT_MANAGER') {
              this.isAccountManager = true;
          }
          else {
              this.isAdmin = false;
          }
        }
    )
  }

}
