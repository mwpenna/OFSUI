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
      defaultValue: new FormControl(),
      isPropNameError: new FormControl(false),
      isPropNameMessage: new FormControl(),
      isPropTypeError: new FormControl(false),
      isPropTypeMessage: new FormControl(),
      isPropRequiredError: new FormControl(false),
      isPropRequiredMessage: new FormControl(),
      isLast: new FormControl(true),
      isDefaultValue: new FormControl(false),
      isDefaultValueError:new FormControl(false),
      isPropDefaultValueMessage:new FormControl(),
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
