import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {UserAPIService} from "../../+home/userapi.service";

@FadeInTop()
@Component({
  selector: 'sa-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  userProfile: any;

  constructor(private userService: UserAPIService) {
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

  ngOnInit() {
    this.userService.getObservableUser().subscribe(user => {
      this.userProfile.firstname = user.firstName;
      this.userProfile.lastname = user.lastName;
      this.userProfile.emailaddress = user.emailAddress;
      this.userProfile.companyname = user.company.name;
      this.userProfile.username = user.userName;
      this.userProfile.role = user.role;
      this.userProfile.id = user.id;
    })

    var now = new Date;
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    var stringDate = monthNames[now.getMonth()] +" " + pad(now.getDay()) +", " + now.getFullYear();

    this.userProfile.currenttime = stringDate;

    function pad(n){return n<10 ? '0'+n : n}
  }

}
