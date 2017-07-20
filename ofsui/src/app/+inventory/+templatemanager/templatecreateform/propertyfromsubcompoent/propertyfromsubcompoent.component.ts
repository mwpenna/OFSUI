import {Component, Input} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-propertyfromsubcompoent',
  templateUrl: './propertyfromsubcompoent.component.html'
})
export class PropertyfromsubcompoentComponent {
  @Input() myForm: FormGroup
}
