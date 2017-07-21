import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl} from "@angular/forms";
import {ArrayType} from "@angular/compiler/src/output/output_ast";
import {TemplateAPIService} from "../../../core/api/templateapi.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {HttpExceptionHandler} from "../../../core/api/httpexceptionhandler";
import {Router} from "@angular/router";

@Component({
  selector: 'app-templatecreateform',
  templateUrl: './templatecreateform.component.html'
})
export class TemplatecreateformComponent implements OnInit {
  @Input() inputArray: ArrayType[];
  myForm: FormGroup

  constructor(private fb: FormBuilder, private templateService: TemplateAPIService,
              private httpExceptionHandler: HttpExceptionHandler, private router: Router) { }

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
        isPropNameError: new FormControl(false),
        isPropNameMessage: new FormControl(),
        isPropTypeError: new FormControl(false),
        isPropTypeMessage: new FormControl(),
        isPropRequiredError: new FormControl(false),
        isPropRequiredMessage: new FormControl(),
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
        formGroup.get("isPropNameError").setValue(true)
        formGroup.get("isPropNameMessage").setValue("Another Template column exists with the same name. Please use a different name or delete one of the duplicates.")
      }
    }
  }

  private validateForm() :boolean {
    var isFormValid = true;

    if(this.myForm.value.name == null) {
      this.myForm.get("isNameError").setValue(true)
      this.myForm.get("nameErrorMessage").setValue("Please provide a name.")
      isFormValid = false;
    }

    const arrayControl = <FormArray>this.myForm.controls['formArray']
    for(let control of arrayControl.controls) {
      const formGroup = <FormGroup>control;

      if(formGroup.get("propName").value == null) {
        formGroup.get("isPropNameError").setValue(true)
        formGroup.get("isPropNameMessage").setValue("Please provide a name.")
        isFormValid = false;
      }

      if(formGroup.get("propType").value == null) {
        formGroup.get("isPropTypeError").setValue(true)
        formGroup.get("isPropTypeMessage").setValue("Please select a type.")
        isFormValid = false;
      }

      if(formGroup.get("propRequired").value == null) {
        formGroup.get("isPropRequiredError").setValue(true)
        formGroup.get("isPropRequiredMessage").setValue("Please select if required.")
        isFormValid = false;
      }
    }

    return isFormValid;
  }

  private resetFormErrorMessages() {
    this.myForm.get("isNameError").setValue(false)
    this.myForm.get("nameErrorMessage").setValue("")

    const arrayControl = <FormArray>this.myForm.controls['formArray']

    for(let control of arrayControl.controls) {
      const formGroup = <FormGroup>control;
      formGroup.get("isPropNameError").setValue(false)
      formGroup.get("isPropNameMessage").setValue("")
      formGroup.get("isPropTypeError").setValue(false)
      formGroup.get("isPropTypeMessage").setValue("")
      formGroup.get("isPropRequiredError").setValue(false)
      formGroup.get("isPropRequiredMessage").setValue("")
    }
  }

  onSubmit(): void {
    console.log("Inside onSubmit");
    this.resetFormErrorMessages();
    if(this.validateForm()) {
      this.templateService.createTemplate(this.generateCreateTemplateObject())
          .catch(this.handleError)
          .subscribe(
              results => {
                console.log("Successfully created user")
                this.router.navigate(['/home']);
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
                }
              })
    }
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

