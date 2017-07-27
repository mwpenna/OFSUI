import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";
import {TemplateAPIService} from "../../../core/api/templateapi.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {FormBuilder, FormGroup, FormControl, FormArray} from "@angular/forms";

@Component({
  selector: 'app-inventorycreateform',
  templateUrl: './inventorycreateform.component.html'
})
export class InventorycreateformComponent implements OnInit {

  @ViewChild('inventoryCreateModal') public inventoryCreateModal:ModalDirective;
  myForm: FormGroup

  public templateNameList: string[] = [];
  public templateList: any[] = [];

  constructor(private templateAPI: TemplateAPIService,
              private fb: FormBuilder) { }

  ngOnInit() {
    let newForm = this.fb.group({
      name: new FormControl(),
      price: new FormControl(),
      type: new FormControl(),
      quantity: new FormControl(),
      description: new FormControl(),
      formArray: this.fb.array([])
    })

   this.myForm  = newForm;

    this.myForm.valueChanges.subscribe(data => {
      console.log('Form changes', data)

      if(this.isTypePresent()) {
        var propList = this.getListProps();

        if(propList != undefined && propList != null) {
          this.generatePropFormGroup(propList);
        }
        else {
          this.myForm.controls['formArray'] = new FormArray([]);
        }
        console.log(this.myForm)
      }
      else {
        this.myForm.controls['formArray'] = new FormArray([]);
        console.log(this.myForm)
      }
    })
  }

  private generatePropFormGroup(propList: any[]) {
    this.myForm.controls['formArray'] = new FormArray([]);
    const arrayControl = <FormArray>this.myForm.controls['formArray'];

    for(let prop of propList) {
      let newGroup = this.fb.group({
        propName: new FormControl(prop.name),
        propValue: new FormControl()
      })
      arrayControl.push(newGroup);
    }
  }

  private isTypePresent():boolean {
    return this.myForm.value.type != undefined && this.myForm.value.type != "" && this.myForm.value.type!=null;
  }

  private getListProps(): any[] {
    for(let template of this.templateList) {
      if(template.name === this.myForm.value.type) {
        return template.props;
      }
    }
  }

  public showCreateInventoryModal() {
    console.log("Inside show create inventory");
    this.getTemplatesByCompanyId();
    this.inventoryCreateModal.show();
  }

  public createInventory() {
    console.log("Inside create inventory");

  }

  private getTemplatesByCompanyId() {
    this.templateAPI.getTemplateByCompanyId()
        .map(this.extractData)
        .catch(this.handleError)
        .subscribe(
            result => {
              console.log(result);
              for(let template of result.items) {
                this.templateNameList.push(template.name);
                this.templateList.push(template);
              }
              console.log(this.templateNameList);
            },
            error => {
              console.log(error);
            }
        );
  }

  private extractData(res:Response) {
    return res.json();
  }

  private handleError(error:any) {
    return Observable.throw(error);
  }

}
