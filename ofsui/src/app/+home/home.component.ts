import { Component, OnInit } from '@angular/core';
import {UserAPIService} from "./userapi.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private userService: UserAPIService) { }

  ngOnInit() {
      // this.userService.setUser();
  }

}
