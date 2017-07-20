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
    const arrayControl = <FormArray>this.myForm.controls['formArray'];

    for(let control of arrayControl.controls) {
      control.get('isLast').setValue(false)
    }

    let newGroup = this.fb.group({
      propName: new FormControl(),
      propType: new FormControl(),
      propRequired: new FormControl(),
      isLast: new FormControl(true),
      itemPropName: [[Validators.required]],
      itemPropType: [[Validators.required]],
      itemPropRequired: [[Validators.required]]
    })

    arrayControl.push(newGroup);
  }

  delInput(): void {
    const arrayControl = <FormArray>this.myForm.controls['formArray'];

    var i = 0;

    for(let control of arrayControl.controls) {
      if(control == this.itemForm) {
        arrayControl.removeAt(i);
      }
      i++
    }
  }
}
