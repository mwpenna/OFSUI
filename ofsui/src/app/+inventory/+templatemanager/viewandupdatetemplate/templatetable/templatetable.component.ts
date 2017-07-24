import {Component, OnInit, ViewChild} from '@angular/core';
import {TemplateAPIService} from "../../../../core/api/templateapi.service";
import {HttpExceptionHandler} from "../../../../core/api/httpexceptionhandler";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {TemplateSearchService} from "../templatesearchform/templatesearch.service";
import {ModalDirective} from "ngx-bootstrap";
import {FormGroup, Validators, FormBuilder, FormControl, FormArray} from "@angular/forms";


@Component({
  selector: 'app-templatetable',
  templateUrl: './templatetable.component.html'
})
export class TemplatetableComponent implements OnInit {
  myForm: FormGroup

  public items: any[];
  public tableColumnNames: string[] = [];
  public maxPropListSize =1;
  public resultList: any[];

  public count = 0;
  public numPages: number[];
  public maxPage: number;
  public selectedPage:number=1;
  public isInitialLoad:boolean=true;

  public template:any;
  public templateId: number;

  @ViewChild('lgModal') public lgModal:ModalDirective;

  constructor( private templateService: TemplateAPIService,
               private httpExceptionHandler: HttpExceptionHandler,
               private templateSearchService: TemplateSearchService,
               private fb: FormBuilder) { }

  ngOnInit() {
    this.createAndResetForm();

    this.templateSearchService.setRequest({});
    this.templateService.search({}, this.templateSearchService.getPageLimit(), 0)
        .map(this.extractData)
        .catch(this.handleError)
        .subscribe(
            result => {
              this.templateSearchService.announceSearchResults(result);
            },
            error => {
              this.httpExceptionHandler.handleException(error);
            }
        );

    this.templateSearchService.searchResultAnnounced$.subscribe(
        results => {
          this.buildTableColumnNames(results.items)
          this.buildItemList(results.items)
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

  private buildItemList(templateList: any[]){
    var items = []
    var itemLocation = 0;

    for(let template of templateList) {
      var data = [];
      data[0] = ""
      data[1] = ""
      data[2] = template.id
      data[3] = template.name
      this.mapProps(data, template)

      items[itemLocation] = data
      itemLocation++
    }

    this.items = items
  }

  private mapProps(data: any[], template: any) {
    for(var i = 0; i < this.maxPropListSize; i++) {
      if(template.props.length > i) {
        this.mapProp(data, template.props[i])
      }
      else {
        this.mapOBProp(data)
      }
    }
  }

  private createAndResetForm() {
    let newForm = this.fb.group({
      formArray: this.fb.array([])
    });

    this.myForm = newForm;
  }

  public showUpdateTemplateModal(templateIndex:number) {
    this.createAndResetForm();
    this.templateId = this.resultList[templateIndex].id
    this.createUpdateForm(templateIndex)
    this.lgModal.show();
  }

  private createUpdateForm(templateIndex:number) {
    var i = 1;
    for(let prop of this.resultList[templateIndex].props) {

      const arrayControl = <FormArray>this.myForm.controls['formArray'];
      let newGroup = this.fb.group({
        propName: new FormControl(prop.name),
        propType: new FormControl(prop.type),
        propRequired: new FormControl(this.getRequiredValue(prop)),
        defaultValue: new FormControl(),
        isPropNameError: new FormControl(false),
        isPropNameMessage: new FormControl(),
        isPropTypeError: new FormControl(false),
        isPropTypeMessage: new FormControl(),
        isPropRequiredError: new FormControl(false),
        isPropRequiredMessage: new FormControl(),
        isDefaultValue: new FormControl(false),
        isDefaultValueError:new FormControl(false),
        isPropDefaultValueMessage:new FormControl(),
        isLast: new FormControl(this.isLast(this.resultList[templateIndex].props.length, i)),
        itemPropName: [[Validators.required]],
        itemPropType: [[Validators.required]],
        itemPropRequired: [[Validators.required]]
      })
      arrayControl.push(newGroup);

      i++;
    }
  }

  private isLast(propLength: number, spot: number) : boolean {
    var isLast = true;

    if(propLength != spot) {
      isLast = false;
    }

    return isLast;
  }

  private getRequiredValue(prop: any): string {
    var required = "";

    if(prop.required == true) {
      required = "TRUE"
    }

    if(prop.required == false) {
      required = "FALSE"
    }

    return required;
  }

  private defaultPaginationValues() {
    this.selectedPage=1;
    this.count=0;
  }

  private setNumPages(length:number){
    var x=[];
    var i=1;
    while(x.push(i++)<length){};
    this.maxPage = length;
    return x
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

      this.templateService.search(this.templateSearchService.getRequest(), this.templateSearchService.getPageLimit(), (this.templateSearchService.getPageLimit()*(page-1)))
          .map(this.extractData)
          .catch(this.handleError)
          .subscribe(
              results => {
                this.buildTableColumnNames(results.items)
                this.buildItemList(results.items)
                this.count = results.count;
                this.resultList = results.items;
              },
              error => {
                this.httpExceptionHandler.handleException(error);
              }
          );

  }

  public deleteTemplate(templateIndex: number) {
    this.templateService.delete(this.resultList[templateIndex].id)
        .map(this.extractData)
        .catch(this.handleError)
        .subscribe(
            results => {
              this.templateService.search(this.templateSearchService.getRequest(), this.templateSearchService.getPageLimit(), 0)
                  .map(this.extractData)
                  .catch(this.handleError)
                  .subscribe(
                      result => {
                        console.log(result);
                        this.templateSearchService.announceSearchResults(result);
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

  public updateTemplate() {
    if(this.validateForm()) {
      console.log("Form is valid")
      this.templateService.update(this.templateId, this.generateCreateTemplateObject())
          .catch(this.handleError)
          .subscribe(
              results => {
                this.templateService.search(this.templateSearchService.getRequest(), this.templateSearchService.getPageLimit(), 0)
                    .map(this.extractData)
                    .catch(this.handleError)
                    .subscribe(
                        result => {
                          console.log(result);
                          this.templateSearchService.announceSearchResults(result);
                        },
                        error => {
                          this.httpExceptionHandler.handleException(error);
                        }
                    );
                this.lgModal.hide();

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
                  else if (errors[i].code == "template.props.default_value.required_field_missing") {
                    this.handleMissingDefaultValue(errors[i].properties.name)
                  }
                }
              });
    }
  }

  private generateCreateTemplateObject():any {
    return {
      props: this.generatePropList()
    }
  }

  private generatePropList(): any {
    const arrayControl = <FormArray>this.myForm.controls['formArray']

    let propList : {name: string, type: string, required: boolean, defaultValue: string} [] = []

    for(let control of arrayControl.controls) {
      const formGroup = <FormGroup>control;

      if(formGroup.get("isDefaultValue").value) {
        propList.push({name: formGroup.get("propName").value, type: formGroup.get("propType").value,
          required:  (formGroup.get("propRequired").value == 'TRUE'), defaultValue: formGroup.get("defaultValue").value})
      }
      else {
        propList.push({name: formGroup.get("propName").value, type: formGroup.get("propType").value,
          required:  (formGroup.get("propRequired").value == 'TRUE'), defaultValue: ""})
      }
    }

    return propList
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

  private handleMissingDefaultValue(missingDefaultValue:string) {
    const arrayControl = <FormArray>this.myForm.controls['formArray']

    for(let control of arrayControl.controls) {
      const formGroup = <FormGroup>control;

      if (formGroup.get("propName").value == missingDefaultValue) {
        formGroup.get("isDefaultValue").setValue(true)
      }
    }
  }

  private validateForm() :boolean {
    var isFormValid = true;

    const arrayControl = <FormArray>this.myForm.controls['formArray']
    for(let control of arrayControl.controls) {
      const formGroup = <FormGroup>control;

      if(formGroup.get("propName").value == null || formGroup.get("propName").value == "") {
        formGroup.get("isPropNameError").setValue(true)
        formGroup.get("isPropNameMessage").setValue("Please provide a name.")
        isFormValid = false;
      }

      if(formGroup.get("propType").value == null || formGroup.get("propType").value == "") {
        formGroup.get("isPropTypeError").setValue(true)
        formGroup.get("isPropTypeMessage").setValue("Please select a type.")
        isFormValid = false;
      }

      if(formGroup.get("propRequired").value == null || formGroup.get("propRequired").value == "") {
        formGroup.get("isPropRequiredError").setValue(true)
        formGroup.get("isPropRequiredMessage").setValue("Please select if required.")
        isFormValid = false;
      }

      if(formGroup.get("isDefaultValue").value){
        if(formGroup.get("defaultValue").value == null || formGroup.get("defaultValue").value == "") {
          formGroup.get("isDefaultValueError").setValue(true)
          formGroup.get("isPropDefaultValueMessage").setValue("Please provide default value.")
          isFormValid = false;
        }
      }

    }

    return isFormValid;
  }

  private mapOBProp(data: any[]){
    data[data.length]= "N/A"
    data[data.length]= "N/A"
    data[data.length]= "N/A"
  }

  private mapProp(data: any[], prop: any) {
    data[data.length]= prop.name
    data[data.length]= prop.type
    data[data.length]= prop.required
  }

  private buildTableColumnNames(templateList: any[]) {
    var columnNames= [];

    columnNames[columnNames.length] = ""
    columnNames[columnNames.length] = ""
    columnNames[columnNames.length] = "Id"
    columnNames[columnNames.length] = "Name"

    for(let template of templateList) {
      if(template.props.length > this.maxPropListSize) {
        this.maxPropListSize = template.props.length
      }
    }

    for(var i = 0; i < this.maxPropListSize; i++) {
      columnNames[columnNames.length] = "Column" + (i+1) + ": Name"
      columnNames[columnNames.length] = "Column" + (i+1) + ": Type"
      columnNames[columnNames.length] = "Column" + (i+1) + ": Required"
    }

    console.log(columnNames)
    this.tableColumnNames = columnNames;
  }

  private extractData(res:Response) {
    return res.json();
  }

  private handleError(error:any) {
    return Observable.throw(error);
  }

}
