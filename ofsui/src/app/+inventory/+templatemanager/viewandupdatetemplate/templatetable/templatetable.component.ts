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
    var data = [];
    var items = []
    var itemLocation = 0;
    for(let template of templateList) {
      data = [];
      data[0] = template.id
      data[1] = template.name
      console.log("Here")

      for(var i = 0; i < this.maxPropListSize; i++) {
        console.log("Looping Here: "+ i)
        if(template.props.length > i) {
          console.log("Not OB here at: "+ i)
          data[data.length]= template.props[i].name
          data[data.length]= template.props[i].type
          data[data.length]= template.props[i].required
        }
        else {
          console.log("OB here at: "+ i)
          data[data.length]= "N/A"
          data[data.length]= "N/A"
          data[data.length]= "N/A"
        }
      }

      console.log(data)
      items[itemLocation] = data
      itemLocation++
    }

    console.log(items)
    this.items = items
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
