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
        isLast: new FormControl(true),
        itemPropName: [[Validators.required]],
        itemPropType: [[Validators.required]],
        itemPropRequired: [[Validators.required]]
      })
      arrayControl.push(newGroup);
    }

    this.myForm = newForm;
  }

  onSubmit(): void {
    console.log("Inside onSubmit");
    console.log(this.generateCreateTemplateObject())
    this.templateService.createTemplate(this.generateCreateTemplateObject())
        .catch(this.handleError)
        .subscribe(
            results => {
              console.log(results)
            },
            error => {
              console.log(error)
              this.httpExceptionHandler.handleException(error)
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

