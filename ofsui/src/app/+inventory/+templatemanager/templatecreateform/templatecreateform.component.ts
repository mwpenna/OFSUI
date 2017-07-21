import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl} from "@angular/forms";
import {ArrayType} from "@angular/compiler/src/output/output_ast";
import {TemplateAPIService} from "../../../core/api/templateapi.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {HttpExceptionHandler} from "../../../core/api/httpexceptionhandler";

@Component({
  selector: 'app-templatecreateform',
  templateUrl: './templatecreateform.component.html'
})
export class TemplatecreateformComponent implements OnInit {
  @Input() inputArray: ArrayType[];
  myForm: FormGroup

  constructor(private fb: FormBuilder, private templateService: TemplateAPIService,
              private httpExceptionHandler: HttpExceptionHandler) { }

  ngOnInit() {
    let newForm = this.fb.group({
      appearsOnce: ['InitialValue', [Validators.required, Validators.maxLength(25)]],
      name: new FormControl(),
      isNameError: new FormControl(false),
      nameErrorMessage: new FormControl(),
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
        isDuplicateError: new FormControl(false),
        isDuplicateErrorMessage: new FormControl(),
        isLast: new FormControl(true),
        itemPropName: [[Validators.required]],
        itemPropType: [[Validators.required]],
        itemPropRequired: [[Validators.required]]
      })
      arrayControl.push(newGroup);
    }

    this.myForm = newForm;
  }

  private handleTemplateNameExistsError() {
    this.myForm.get("isNameError").setValue(true)
    this.myForm.get("nameErrorMessage").setValue("Template name already exists. Please choose another template name.")
    this.myForm.get("name").setValue("")
  }

  private handleDuplicatePropName(duplicatePropName:string) {
    const arrayControl = <FormArray>this.myForm.controls['formArray']

    for(let control of arrayControl.controls) {
      const formGroup = <FormGroup>control;

      if(formGroup.get("propName").value == duplicatePropName) {
        formGroup.get("isDuplicateError").setValue(true)
        formGroup.get("isDuplicateErrorMessage").setValue("Another Template column exists with the same name. Please use a different name or delete one of the duplicates.")
      }
    }
  }

  onSubmit(): void {
    console.log("Inside onSubmit");
    this.templateService.createTemplate(this.generateCreateTemplateObject())
        .catch(this.handleError)
        .subscribe(
            results => {
            },
            error => {
              this.httpExceptionHandler.handleException(error)
              var errors = error.json().errors;

              for(var i = 0; i< errors.length; i++) {

                if (errors[i].code == "template.name.exists") {
                  this.handleTemplateNameExistsError();
                }
                else if (errors[i].code == "props.name.duplicate") {
                  this.handleDuplicatePropName(errors[i].properties.name)
                }
                else {
                  console.log("Unhandled error")
                  console.log(errors[i].code)
                }
              }
            }
        )
  }

  private generateCreateTemplateObject():any {
    return {
      name: this.myForm.value.name,
      props: this.generatePropList()
    }
  }

  private generatePropList(): any {
    const arrayControl = <FormArray>this.myForm.controls['formArray']

    let propList : {name: string, type: string, required: boolean} [] = []

    for(let control of arrayControl.controls) {
      const formGroup = <FormGroup>control;
      propList.push({name: formGroup.get("propName").value, type: formGroup.get("propType").value, required:  (formGroup.get("propRequired").value == 'TRUE')})
    }

    return propList
  }

  private extractData(res:Response) {
    return res.json();
  }

  private handleError(error:any) {
    return Observable.throw(error);
  }
}

