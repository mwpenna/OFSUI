import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'app-userstable',
  templateUrl: './userstable.component.html'
})
export class UserstableComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
