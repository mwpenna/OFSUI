import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {TemplateAPIService} from "../../../../core/api/templateapi.service";
import {HttpExceptionHandler} from "../../../../core/api/httpexceptionhandler";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {TemplateSearchService} from "../templatesearchform/templatesearch.service";
import {ModalDirective} from "ngx-bootstrap";
import {ArrayType} from "@angular/compiler/src/output/output_ast";
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
  @ViewChild('deleteModal') public deleteModal:ModalDirective;

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
              console.log(result);
              this.templateSearchService.announceSearchResults(result);
            },
            error => {
              this.httpExceptionHandler.handleException(error);
            }
        );

    this.templateSearchService.searchResultAnnounced$.subscribe(
        results => {
          console.log(results.items)
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
    var i = 1;
    for(let prop of this.resultList[templateIndex].props) {

      var isLast = true;

      if(this.resultList[templateIndex].props.length != i) {
        isLast = false;
      }

      console.log(prop.required);
      var required = "";

      if(prop.required == true) {
        console.log("REQURED")
        required = "TRUE"
      }

      if(prop.required == false) {
        console.log("Not REQURED")
        required = "FALSE"
      }

      const arrayControl = <FormArray>this.myForm.controls['formArray'];
      let newGroup = this.fb.group({
        propName: new FormControl(prop.name),
        propType: new FormControl(prop.type),
        propRequired: new FormControl(required),
        isPropNameError: new FormControl(false),
        isPropNameMessage: new FormControl(),
        isPropTypeError: new FormControl(false),
        isPropTypeMessage: new FormControl(),
        isPropRequiredError: new FormControl(false),
        isPropRequiredMessage: new FormControl(),
        isLast: new FormControl(isLast),
        itemPropName: [[Validators.required]],
        itemPropType: [[Validators.required]],
        itemPropRequired: [[Validators.required]]
      })
      arrayControl.push(newGroup);

      i++;
    }

    this.lgModal.show();
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
    console.log("Inside Delete Template");
    console.log(templateIndex);
    console.log(this.resultList[templateIndex].id);
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
