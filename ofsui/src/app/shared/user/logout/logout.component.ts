import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NotificationService} from "../../utils/notification.service";
import {AuthService} from "../../../+auth/auth.service";

declare var $:any;

@Component({
  selector: 'sa-logout',
  template: `
<div id="logout" (click)="showPopup()" class="btn-header transparent pull-right">
        <span> <a routerlink="/auth/login" title="Sign Out" data-action="userLogout"
                  data-logout-msg="Are you sure you would like to log off?"><i
          class="fa fa-sign-out"></i></a> </span>
    </div>
  `,
  styles: []
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router,
              private notificationService: NotificationService,
              private authService: AuthService) { }

  showPopup(){
    this.notificationService.smartMessageBox({
      title : "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span>",
      content : "Are you sure you would like to log off?",
      buttons : '[No][Yes]'

    }, (ButtonPressed) => {
      if (ButtonPressed == "Yes") {
        this.logout()
      }
    });
  }

  logout(){
      this.authService.logout();
      this.router.navigate(['/auth/login'])
  }

  ngOnInit() {

  }



}
