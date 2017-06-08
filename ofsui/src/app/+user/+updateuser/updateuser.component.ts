import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.component.html'
})
export class UpdateUserComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
