import {Component, OnInit, Input} from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {UserAPIService} from "../../core/api/userapi.service";
import {UserState} from "../../core/redux/reducers/user.reducer";
import {Store} from "@ngrx/store";

@FadeInTop()
@Component({
  selector: 'sa-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  userProfile: any;

  constructor(private userService: UserAPIService, private store: Store<UserState>) {
    this.userProfile = {
      "firstname" : "",
      "lastname" : "",
      "picture": "assets/img/avatars/user-no-image.png",
      "emailaddress" : "",
      "companyname" : "",
      "username" : "",
      "role" : "",
      "id" : "",
      "currenttime" : ""
    };
  }

  @Input()  public options = {
    mode: 'inline',
    disabled: false,
    inline: true
  };

  ngOnInit() {
    this.store.subscribe(
        user => {
          this.userProfile.firstname = user.currentUser.firstname;
          this.userProfile.lastname = user.currentUser.lastname;
          this.userProfile.emailaddress = user.currentUser.emailaddress;
          this.userProfile.companyname = user.currentUser.companyname;
          this.userProfile.username = user.currentUser.username;
          this.userProfile.role = user.currentUser.role;
          this.userProfile.id = user.currentUser.id;
        }
    );

    var now = new Date;
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    var stringDate = monthNames[now.getMonth()] +" " + pad(now.getDay()) +", " + now.getFullYear();

    this.userProfile.currenttime = stringDate;

    function pad(n){return n<10 ? '0'+n : n}
  }

}
