import {Component, OnInit, Input} from '@angular/core';
import {FormGroup, FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-inventorypropssubcomponent',
  templateUrl: './inventorypropssubcomponent.component.html'
})
export class InventorypropssubcomponentComponent implements OnInit {

  @Input() itemFormGroup: FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
