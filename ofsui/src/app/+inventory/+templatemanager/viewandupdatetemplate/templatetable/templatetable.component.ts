import { Component, OnInit } from '@angular/core';
import {TemplateAPIService} from "../../../../core/api/templateapi.service";
import {HttpExceptionHandler} from "../../../../core/api/httpexceptionhandler";
import {Observable} from "rxjs";
import {Response} from "@angular/http";


@Component({
  selector: 'app-templatetable',
  templateUrl: './templatetable.component.html'
})
export class TemplatetableComponent implements OnInit {

  public items: any[];
  public tableColumnNames: string[] = [];
  public maxPropListSize =1;

  constructor( private templateService: TemplateAPIService,
               private httpExceptionHandler: HttpExceptionHandler) { }

  ngOnInit() {
    this.templateService.getTemplateByCompanyId()
        .map(this.extractData)
        .catch(this.handleError)
        .subscribe(
            result => {
              this.buildTableColumnNames(result.items)
              this.buildItemList(result.items)
            },
            error => {
              this.httpExceptionHandler.handleException(error)
              console.log(error)
            }
        )
  }

  private buildItemList(templateList: any[]){
    var items = []
    var itemLocation = 0;

    for(let template of templateList) {
      var data = [];
      data[0] = template.id
      data[1] = template.name
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
