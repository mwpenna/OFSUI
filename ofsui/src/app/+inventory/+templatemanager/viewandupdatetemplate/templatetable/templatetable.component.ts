import {Component, OnInit, ViewChild} from '@angular/core';
import {TemplateAPIService} from "../../../../core/api/templateapi.service";
import {HttpExceptionHandler} from "../../../../core/api/httpexceptionhandler";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {TemplateSearchService} from "../templatesearchform/templatesearch.service";
import {ModalDirective} from "ngx-bootstrap";


@Component({
  selector: 'app-templatetable',
  templateUrl: './templatetable.component.html'
})
export class TemplatetableComponent implements OnInit {

  public items: any[];
  public tableColumnNames: string[] = [];
  public maxPropListSize =1;

  public count = 0;
  public numPages: number[];
  public maxPage: number;
  public selectedPage:number=1;
  public isInitialLoad:boolean=true;

  public template:any;

  @ViewChild('lgModal') public lgModal:ModalDirective;
  @ViewChild('deleteModal') public deleteModal:ModalDirective;

  constructor( private templateService: TemplateAPIService,
               private httpExceptionHandler: HttpExceptionHandler,
               private templateSearchService: TemplateSearchService) { }

  ngOnInit() {
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

  public showUpdateTemplateModal(template:any) {
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

    if(this.isInitialLoad) {

    }
    else {
      this.templateService.search(this.templateSearchService.getRequest(), this.templateSearchService.getPageLimit(), (this.templateSearchService.getPageLimit()*(page-1)))
          .map(this.extractData)
          .catch(this.handleError)
          .subscribe(
              results => {
                this.buildTableColumnNames(results.items)
                this.buildItemList(results.items)
                this.count = results.count;
              },
              error => {
                this.httpExceptionHandler.handleException(error);
              }
          );
    }

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
