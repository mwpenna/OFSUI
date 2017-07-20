import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl} from "@angular/forms";
import {ArrayType} from "@angular/compiler/src/output/output_ast";


@Component({
  selector: 'app-templatecreateform',
  templateUrl: './templatecreateform.component.html'
})
export class TemplatecreateformComponent implements OnInit {
  @Input() inputArray: ArrayType[];
  myForm: FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    let newForm = this.fb.group({
      appearsOnce: ['InitialValue', [Validators.required, Validators.maxLength(25)]],
      formArray: this.fb.array([])
    });
    const arrayControl = <FormArray>newForm.controls['formArray'];

    if(this.inputArray!= undefined){
      this.inputArray.forEach(item => {
        let newGroup = this.fb.group({
          itemPropName: [[Validators.required]],
          itemPropType: [[Validators.required]],
          itemPropRequired: [[Validators.required]]
        });
        arrayControl.push(newGroup);
      });
    }
    else {
      const arrayControl = <FormArray>newForm.controls['formArray'];
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

    this.myForm = newForm;
  }

  addInput(): void {
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
  delInput(index: number): void {
    const arrayControl = <FormArray>this.myForm.controls['formArray'];
    arrayControl.removeAt(index);
  }
  onSubmit(): void {
    console.log(this.myForm.value);
    // Your form value is outputted as a JavaScript object.
    // Parse it as JSON or take the values necessary to use as you like
  }


}
