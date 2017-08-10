import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";
import {TemplateAPIService} from "../../../core/api/templateapi.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {FormBuilder, FormGroup, FormControl, FormArray} from "@angular/forms";
import {InventoryAPIService} from "../../../core/api/inventoryapi.service";
import {HttpExceptionHandler} from "../../../core/api/httpexceptionhandler";
import {isNumeric} from "rxjs/util/isNumeric";
import {InventorySearchService} from "../inventorysearchform/inventorysearch.service";

@Component({
  selector: 'app-inventorycreateform',
  templateUrl: './inventorycreateform.component.html'
})
export class InventorycreateformComponent implements OnInit {

  @ViewChild('inventoryCreateModal') public inventoryCreateModal:ModalDirective;
  myForm: FormGroup

  public templateNameList: string[] = [];
  public templateList: any[] = [];
  private previousType: string;

  constructor(private templateAPI: TemplateAPIService,
              private fb: FormBuilder,
              private inventoryAPI: InventoryAPIService,
              private inventorySearchService: InventorySearchService,
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
  }

  private generatePropFormGroup(propList: any[]) {
    this.myForm.controls['formArray'] = new FormArray([]);
    const arrayControl = <FormArray>this.myForm.controls['formArray'];

    for(let prop of propList) {
      let newGroup = this.fb.group({
        propName: new FormControl(prop.name),
        propValue: new FormControl(),
        propType: new FormControl(prop.type),
        isPropNameError: new FormControl(false),
        propNameErrorMessage: new FormControl()
      })
      arrayControl.push(newGroup);
    }
  }

  private isTypePresent():boolean {
    return this.myForm.value.type != undefined && this.myForm.value.type != "" &&
        this.myForm.value.type!=null && this.myForm.value.type != this.previousType;
  }

  private getListProps(): any[] {
    for(let template of this.templateList) {
      if(template.name === this.myForm.value.type) {
        return template.props;
      }
    }
  }

  public showCreateInventoryModal() {
    this.myForm.valueChanges.subscribe(data => {
      if(this.isTypePresent()) {
        this.previousType = this.myForm.value.type;
        var propList = this.getListProps();

        if(propList != undefined && propList != null) {
          this.generatePropFormGroup(propList);
        }
        else {
          this.myForm.controls['formArray'] = new FormArray([]);
        }
      }
      else if(this.myForm.value.type == "" || this.myForm.value.type == undefined){
        this.myForm.controls['formArray'] = new FormArray([]);
      }
    })

    this.getTemplatesByCompanyId();
    this.inventoryCreateModal.show();
  }

  public cancelInventoryCreate() {
    this.defaultCreateInventoryForm();
    this.inventoryCreateModal.hide();
  }

  public createInventory() {
    this.clearErrors();
    if(this.validateCreateInventory()) {
      this.inventoryAPI.createInventory(this.generateCreateInventoryRequest())
          .catch(this.handleError)
          .subscribe(
              result => {
                this.defaultCreateInventoryForm();
                this.inventoryCreateModal.hide();
                this.inventorySearch();
              },
              error => {
                console.log(error);
                this.httpExceptionHandler.handleException(error);
                var errors = error.json().errors;

                for(var i = 0; i< errors.length; i++) {

                  if (errors[i].code == "inventory.type.not_valid") {
                    this.handleInvenotryTypeNotValid();
                  }

                  if(errors[i].code == "inventory.name.exists") {
                    this.handleDuplicateInventoryNameError();
                  }

                  if(errors[i].code == "prop.invalid_value") {
                    this.handleInvalidPropValue(errors[i].properties.name);
                  }
                }
              }
          );
    }
  }

  private inventorySearch() {
    this.inventoryAPI.search({}, this.inventorySearchService.getPageLimit(), 0)
        .map(this.extractData)
        .catch(this.handleError)
        .subscribe(
            result => {
              this.inventorySearchService.announceSearchResults(result);
            },
            error => {
              this.httpExceptionHandler.handleException(error);
            }
        );
  }

  private handleInvalidPropValue(propName: string) {
    console.log(propName);
    const arrayControl = <FormArray>this.myForm.controls['formArray']

    for(let control of arrayControl.controls) {
      const formGroup = <FormGroup>control;

      if (formGroup.get("propName").value == propName) {
        formGroup.get("isPropNameError").setValue(true);
        formGroup.get("propNameErrorMessage").setValue("Invalid value. Please provide a numeric value.")
      }
    }
  }

  private handleDuplicateInventoryNameError() {
    this.myForm.get("isNameError").setValue(true);
    this.myForm.get("nameErrorMessage").setValue("Inventory name already exists. Please choose a different name.");
  }

  private handleInvenotryTypeNotValid() {
    this.myForm.get("isTypeError").setValue(true);
    this.myForm.get("typeErrorMessage").setValue("Inventory Type not valid. Please select one from the list.");
  }

  private clearErrors() {
    this.myForm.get("isNameError").setValue(false);
    this.myForm.get("nameErrorMessage").setValue("");
    this.myForm.get("isTypeError").setValue(false);
    this.myForm.get("typeErrorMessage").setValue("");
    this.myForm.get("isPriceError").setValue(false);
    this.myForm.get("priceErrorMessage").setValue("");
    this.myForm.get("isQuantityError").setValue(false);
    this.myForm.get("quantityErrorMessage").setValue("");

    const arrayControl = <FormArray>this.myForm.controls['formArray']

    for(let control of arrayControl.controls) {
      const formGroup = <FormGroup>control;
      formGroup.get("isPropNameError").setValue(false);
      formGroup.get("propNameErrorMessage").setValue("")
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
    else if(!isNumeric(this.myForm.get("price").value)){
      this.myForm.get("isPriceError").setValue(true);
      this.myForm.get("priceErrorMessage").setValue("Price must be a numeric value.");
      isValid = false;
    }

    if(this.myForm.get("quantity") == undefined || this.myForm.get("quantity").value == null ||
        this.myForm.get("quantity").value == "" ) {
      this.myForm.get("isQuantityError").setValue(true);
      this.myForm.get("quantityErrorMessage").setValue("Please provide inventory quantity.");
      isValid = false;
    }
    else if(!isNumeric(this.myForm.get("quantity").value)){
      this.myForm.get("isQuantityError").setValue(true);
      this.myForm.get("quantityErrorMessage").setValue("Quantity must be a numeric value.");
      isValid = false;
    }

    if(!this.validateProps()) {
      isValid = false;
    }

    return isValid;
  }

  private validateProps(): boolean {
    var isValid = true;

    const arrayControl = <FormArray>this.myForm.controls['formArray']

    for(let control of arrayControl.controls) {
      const formGroup = <FormGroup>control;

      if(formGroup.get("propValue") == undefined || formGroup.get("propValue").value == null ||
          formGroup.get("propValue").value == "" ) {

        formGroup.get("isPropNameError").setValue(true);
        formGroup.get("propNameErrorMessage").setValue("Value is required.")
        isValid = false;
      }
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
    this.previousType = undefined;
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
