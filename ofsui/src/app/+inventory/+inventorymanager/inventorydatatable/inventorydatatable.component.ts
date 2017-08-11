import {Component, OnInit, ViewChild} from '@angular/core';
import {InventoryAPIService} from "../../../core/api/inventoryapi.service";
import {HttpExceptionHandler} from "../../../core/api/httpexceptionhandler";
import {InventorySearchService} from "../inventorysearchform/inventorysearch.service";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, FormControl, FormArray} from "@angular/forms";
import {ModalDirective} from "ngx-bootstrap";
import {isNumeric} from "rxjs/util/isNumeric";
import {TemplateAPIService} from "../../../core/api/templateapi.service";

@Component({
  selector: 'app-inventorydatatable',
  templateUrl: './inventorydatatable.component.html'
})
export class InventorydatatableComponent implements OnInit {
  myForm: FormGroup;

  public items: any[];
  public tableColumnNames: string[] = [];
  public propMap : Map<string, number> = new Map<string, number>();
  public resultList: any[];

  public count = 0;
  public numPages: number[];
  public maxPage: number;
  public selectedPage:number=1;
  public isInitialLoad:boolean=true;

  public inventory:any;
  public inventoryId: number;

  public templateList: Map<string, any> = new Map<string, any>();

  @ViewChild('lgModal') public lgModal:ModalDirective;

  constructor( private inventoryService: InventoryAPIService,
               private httpExceptionHandler: HttpExceptionHandler,
               private inventorySearchService: InventorySearchService,
               private templateService: TemplateAPIService,
               private fb: FormBuilder) { }

  ngOnInit() {
    this.createAndResetForm();
    this.inventorySearchService.setRequest({})

    this.inventoryService.search({}, this.inventorySearchService.getPageLimit(), 0)
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

    this.inventorySearchService.searchResultAnnounced$.subscribe(
        results => {
          this.buildTableColumnNames(results.items);
          this.buildItemList(results.items);
          this.getTemplatesByCompanyId();
          this.count = results.count;
          this.resultList = results.items;

          if((results.count/results.limit) != Math.floor((results.count/results.limit))) {
            this.numPages= this.setNumPages(Math.floor((results.count/results.limit))+1)
          }
          else {
            this.numPages=this.setNumPages(Math.floor((results.count/results.limit)));
          }
          this.isInitialLoad=false;
        }
    );
  }

  public deleteInventory(inventoryIndex: number) {
    this.inventoryService.delete(this.resultList[inventoryIndex].id)
        .map(this.extractData)
        .catch(this.handleError)
        .subscribe(
            results => {
              this.inventoryService.search(this.inventorySearchService.getRequest(), this.inventorySearchService.getPageLimit(), 0)
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
            },
            error => {
              this.httpExceptionHandler.handleException(error);
            }
        );
  }

  public updateInventory() {
    this.clearErrors();
    if(this.validateUpdateInventory()) {
      this.inventoryService.update(this.inventoryId,this.generateUpdateInventoryRequest())
          .catch(this.handleError)
          .subscribe(
              results => {
                this.inventoryService.search(this.inventorySearchService.getRequest(), this.inventorySearchService.getPageLimit(), 0)
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
                this.lgModal.hide();
              },
              error => {
                this.httpExceptionHandler.handleException(error);
                var errors = error.json().errors;

                for(var i = 0; i< errors.length; i++) {
                  if(errors[i].code == "prop.invalid_value") {
                    this.handlePropError(errors[i].properties.name, "Invalid value. Please provide a numeric value.");
                  }
                  if(errors[i].code == "inventory.required.prop.missing") {
                    this.handlePropError(errors[i].properties.name, "Field is required. Please provide a valid value.")
                  }
                }
              }
          );
    }
  }

  private clearErrors() {
    this.myForm.get("isNameError").setValue(false);
    this.myForm.get("nameErrorMessage").setValue("");
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

  private handlePropError(propName: string, message: string) {
    const arrayControl = <FormArray>this.myForm.controls['formArray']

    for(let control of arrayControl.controls) {
      const formGroup = <FormGroup>control;

      if (formGroup.get("propName").value == propName) {
        formGroup.get("isPropNameError").setValue(true);
        formGroup.get("propNameErrorMessage").setValue(message);
      }
    }
  }

  private generateUpdateInventoryRequest(): any {
    return {
      name: this.myForm.get("name").value,
      price: Number(this.myForm.get("price").value),
      quantity: Number(this.myForm.get("quantity").value),
      description: this.myForm.get("description").value,
      props: this.generatePropsForRequest()
    }
  }

  private generatePropsForRequest(): any[] {
    var props = [];

    const arrayControl = <FormArray>this.myForm.controls['formArray'];
    for(let control of arrayControl.controls) {

      if(control.get("propValue").value != null && control.get("propValue").value != "") {
        props.push(
            {
              name: control.get("propName").value,
              value: control.get("propValue").value
            }
        )
      }
    }

    return props;
  }


  private validateUpdateInventory(): boolean {

    var isValid = true;

    if(this.myForm.get("name") == undefined || this.myForm.get("name").value == null ||
        this.myForm.get("name").value == "" ) {
      this.myForm.get("isNameError").setValue(true);
      this.myForm.get("nameErrorMessage").setValue("Please provide inventory name.");
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

    return isValid;
  }

  public showUpdateInventoryModal(inventoryIndex:number) {
    this.createAndResetForm();
    this.inventory = this.resultList[inventoryIndex];
    this.inventoryId = this.inventory.id;
    this.createUpdateForm(inventoryIndex);
    this.lgModal.show();
  }

  private createUpdateForm(inventoryIndex: number) {
    let newForm = this.fb.group({
      name: new FormControl(this.inventory.name),
      price: new FormControl(this.inventory.price),
      quantity: new FormControl(this.inventory.quantity),
      description: new FormControl(this.inventory.description),
      formArray: this.fb.array([]),
      isNameError: new FormControl(false),
      nameErrorMessage: new FormControl(),
      isPriceError: new FormControl(false),
      priceErrorMessage: new FormControl(),
      isQuantityError: new FormControl(false),
      quantityErrorMessage: new FormControl()
    })

    this.myForm = newForm;
    this.generatePropFormGroup();
  }

  private generatePropFormGroup() {
    this.myForm.controls['formArray'] = new FormArray([]);
    const arrayControl = <FormArray>this.myForm.controls['formArray'];

    var propValues = new Map<string, any>();

    for(let prop of this.inventory.props) {
      propValues.set(prop.name, prop.value);
    }

    if(this.templateList.has(this.inventory.type)) {
      for(let prop of this.templateList.get(this.inventory.type).props) {
        var propValue = "";

        if(propValues.has(prop.name)) {
          propValue = propValues.get(prop.name);
        }

        let newGroup = this.fb.group({
          propName: new FormControl(prop.name),
          propValue: new FormControl(propValue),
          propType: new FormControl(prop.type),
          isPropNameError: new FormControl(false),
          propNameErrorMessage: new FormControl()
        })
        arrayControl.push(newGroup);
      }
    }
  }

  private createAndResetForm() {
    let newForm = this.fb.group({
      name: new FormControl(),
      price: new FormControl(),
      quantity: new FormControl(),
      description: new FormControl(),
      formArray: this.fb.array([]),
      isNameError: new FormControl(false),
      nameErrorMessage: new FormControl(),
      isPriceError: new FormControl(false),
      priceErrorMessage: new FormControl(),
      isQuantityError: new FormControl(false),
      quantityErrorMessage: new FormControl()
    });

    this.myForm = newForm;
  }

  public goToPage(page:number) {
    this.selectedPage = page;
    this.getNextPageData(this.selectedPage);
  }

  public previous() {
    this.selectedPage = this.selectedPage-1;
    this.getNextPageData(this.selectedPage);
  }

  public next() {
    this.selectedPage = this.selectedPage+1;
    this.getNextPageData(this.selectedPage);
  }

  private getNextPageData(page:number) {
    this.inventoryService.search(this.inventorySearchService.getRequest(), this.inventorySearchService.getPageLimit(), (this.inventorySearchService.getPageLimit()*(page-1)))
        .map(this.extractData)
        .catch(this.handleError)
        .subscribe(
            results => {
              this.inventorySearchService.announceSearchResults(results);
            },
            error => {
              this.httpExceptionHandler.handleException(error);
            }
        );
  }

  private setNumPages(length:number){
    var x=[];
    var i=1;
    while(x.push(i++)<length){};
    this.maxPage = length;
    return x
  }

  private buildItemList(inventoryList: any[]) {
    var items = [];
    var itemLocation = 0;

    for(let inventory of inventoryList) {
      var data = [];
      data[0] = "";
      data[1] = "";
      data[2] = inventory.id;
      data[3] = inventory.name;
      data[4] = inventory.type;
      data[5] = inventory.price;
      data[6] = inventory.quantity;
      data[7] = inventory.description;

      this.mapProps(data, inventory);
      this.defaultMissingFields(data);

      items[itemLocation] = data
      itemLocation++
    }
    this.items = items;
  }

  private defaultMissingFields(data: any[]) {
    for(var i=0; i< data.length; i++) {
      if(data[i] == null) {
        data[i]= "";
      }
    }

    if(data.length<this.tableColumnNames.length) {
      for(var i=data.length; i< this.tableColumnNames.length; i++) {
        data[i]= "";
      }
    }
  }

  private mapProps(data: any[], inventory: any) {
    for(let prop of inventory.props) {
      if(this.propMap.has(prop.name)) {

        if("TRUE" == prop.value) {
          data[this.propMap.get(prop.name)] = "YES";
        }
        else if ("FALSE" == prop.value) {
          data[this.propMap.get(prop.name)] = "NO";
        }
        else {
          data[this.propMap.get(prop.name)] = prop.value;
        }
      }
    }
  }

  private buildTableColumnNames(inventoryList: any[]) {
    this.propMap = new Map<string, number>();
    var columnNames= [];

    columnNames[columnNames.length] = "";
    columnNames[columnNames.length] = "";
    columnNames[columnNames.length] = "Id";
    columnNames[columnNames.length] = "Name";
    columnNames[columnNames.length] = "Type";
    columnNames[columnNames.length] = "Price";
    columnNames[columnNames.length] = "Quantity";
    columnNames[columnNames.length] = "Description";

    var spot = 8;
    for(let inventory of inventoryList) {
      for(let prop of inventory.props) {
        if(!this.propMap.has(prop.name)) {
          this.propMap.set(prop.name, spot);
          spot++;
        }
      }
    }

    for(let key of Array.from( this.propMap.keys()) ) {
      columnNames[columnNames.length] = key;
    }

    this.tableColumnNames = columnNames;
  }

  private getTemplatesByCompanyId() {
    this.templateService.getTemplateByCompanyId()
        .map(this.extractData)
        .catch(this.handleError)
        .subscribe(
            result => {
              for(let template of result.items) {
                this.templateList.set(template.name, template);
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
