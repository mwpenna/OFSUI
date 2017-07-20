import {Component, Input} from '@angular/core';
import {FormGroup, FormArray, FormControl, Validators, FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-propertyfromsubcompoent',
  templateUrl: './propertyfromsubcompoent.component.html'
})
export class PropertyfromsubcompoentComponent {
  @Input() itemForm: FormGroup
  @Input() myForm: FormGroup

  constructor(private fb: FormBuilder) { }

  addInput(): void {
    console.log("Inside add input")
    console.log(this.itemForm)
    console.log(this.myForm)


    const arrayControl = <FormArray>this.myForm.controls['formArray'];
    let newGroup = this.fb.group({
      propName: new FormControl(),
      propType: new FormControl(),
      propRequired: new FormControl(),
      itemPropName: [[Validators.required]],
      itemPropType: [[Validators.required]],
      itemPropRequired: [[Validators.required]]
    })
    arrayControl.push(newGroup);
  }
}
