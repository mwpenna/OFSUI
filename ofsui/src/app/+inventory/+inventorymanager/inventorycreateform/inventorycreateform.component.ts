import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";
import {TemplateAPIService} from "../../../core/api/templateapi.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {FormBuilder, FormGroup, FormControl, FormArray} from "@angular/forms";
import {InventoryAPIService} from "../../../core/api/inventoryapi.service";
import {HttpExceptionHandler} from "../../../core/api/httpexceptionhandler";

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
              private fb: FormBuilder,
              private inventoryAPI: InventoryAPIService,
              private httpExceptionHandler: HttpExceptionHandler) { }

  ngOnInit() {
    let newForm = this.fb.group({
      name: new FormControl(),
      price: new FormControl(),
      type: new FormControl(),
      quantity: new FormControl(),
      description: new FormControl(),
      formArray: this.fb.array([]),
      isNameError: new FormControl(false),
      nameErrorMessage: new FormControl(),
      isTypeError: new FormControl(false),
      typeErrorMessage: new FormControl(),
      isPriceError: new FormControl(false),
      priceErrorMessage: new FormControl(),
      isQuantityError: new FormControl(false),
      quantityErrorMessage: new FormControl()
    })

   this.myForm  = newForm;

    this.myForm.valueChanges.subscribe(data => {

      if(this.isTypePresent()) {
        var propList = this.getListProps();

        if(propList != undefined && propList != null) {
          this.generatePropFormGroup(propList);
        }
        else {
          this.myForm.controls['formArray'] = new FormArray([]);
        }
      }
      else {
        this.myForm.controls['formArray'] = new FormArray([]);
      }
    })
  }

  private generatePropFormGroup(propList: any[]) {
    this.myForm.controls['formArray'] = new FormArray([]);
    const arrayControl = <FormArray>this.myForm.controls['formArray'];

    for(let prop of propList) {
      let newGroup = this.fb.group({
        propName: new FormControl(prop.name),
        propValue: new FormControl(),
        propType: new FormControl(prop.type)
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
    if(this.validateCreateInventory()) {
      console.log("Validations passed");
      this.inventoryAPI.createInventory(this.generateCreateInventoryRequest())
          .catch(this.handleError)
          .subscribe(
              result => {
                this.defaultCreateInventoryForm();
                this.inventoryCreateModal.hide();
              },
              error => {
                console.log(error);
                this.httpExceptionHandler.handleException(error);
              }
          );
    }
  }

  private validateCreateInventory(): boolean {

    var isValid = true;

    if(this.myForm.get("name") == undefined || this.myForm.get("name").value == null ||
        this.myForm.get("name").value == "" ) {
      this.myForm.get("isNameError").setValue(true);
      this.myForm.get("nameErrorMessage").setValue("Please provide inventory name.");
      isValid = false;
    }

    if(this.myForm.get("type") == undefined || this.myForm.get("type").value == null ||
        this.myForm.get("type").value == "" ) {
      this.myForm.get("isTypeError").setValue(true);
      this.myForm.get("typeErrorMessage").setValue("Please provide inventory type.");
      isValid = false;
    }

    if(this.myForm.get("price") == undefined || this.myForm.get("price").value == null ||
        this.myForm.get("price").value == "" ) {
      this.myForm.get("isPriceError").setValue(true);
      this.myForm.get("priceErrorMessage").setValue("Please provide inventory price.");
      isValid = false;
    }

    if(this.myForm.get("quantity") == undefined || this.myForm.get("quantity").value == null ||
        this.myForm.get("quantity").value == "" ) {
      this.myForm.get("isQuantityError").setValue(true);
      this.myForm.get("quantityErrorMessage").setValue("Please provide inventory quantity.");
      isValid = false;
    }

    return isValid;
  }

  private defaultCreateInventoryForm() {
  let newForm = this.fb.group({
    name: new FormControl(),
    price: new FormControl(),
    type: new FormControl(),
    quantity: new FormControl(),
    description: new FormControl(),
    formArray: this.fb.array([]),
    isNameError: new FormControl(false),
    nameErrorMessage: new FormControl(),
    isTypeError: new FormControl(false),
    typeErrorMessage: new FormControl(),
    isPriceError: new FormControl(false),
    priceErrorMessage: new FormControl(),
    isQuantityError: new FormControl(false),
    quantityErrorMessage: new FormControl()
  })

  this.myForm  = newForm;
  }

  private generateCreateInventoryRequest(): any {
    return {
      name: this.myForm.get("name").value,
      type: this.myForm.get("type").value,
      price: Number(this.myForm.get("price").value),
      quantity: Number(this.myForm.get("quantity").value),
      props: this.generatePropsForRequest()
    }
  }

  private generatePropsForRequest(): any[] {
    var props = [];

    const arrayControl = <FormArray>this.myForm.controls['formArray'];
    for(let control of arrayControl.controls) {
      props.push(
          {
            name: control.get("propName").value,
            value: control.get("propValue").value
          }
      )
    }

    return props;
  }

  private getTemplatesByCompanyId() {
    this.templateAPI.getTemplateByCompanyId()
        .map(this.extractData)
        .catch(this.handleError)
        .subscribe(
            result => {
              this.templateNameList.push("Default");
              for(let template of result.items) {
                this.templateNameList.push(template.name);
                this.templateList.push(template);
              }
            },
            error => {
              this.httpExceptionHandler.handleException(error);
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
