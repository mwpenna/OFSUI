import { Component, OnInit } from '@angular/core';
import {InventoryAPIService} from "../../../core/api/inventoryapi.service";
import {HttpExceptionHandler} from "../../../core/api/httpexceptionhandler";
import {InventorySearchService} from "../inventorysearchform/inventorysearch.service";
import {Response} from "@angular/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-inventorydatatable',
  templateUrl: './inventorydatatable.component.html'
})
export class InventorydatatableComponent implements OnInit {

  public tableColumnNames: string[] = [];
  public propMap : Map<string, string> = new Map<string, string>();

  public isInitialLoad:boolean=true;

  constructor( private inventoryService: InventoryAPIService,
               private httpExceptionHandler: HttpExceptionHandler,
               private inventorySearchService: InventorySearchService) { }

  ngOnInit() {
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
          console.log(results);
          this.buildTableColumnNames(results.items);
          console.log(this.tableColumnNames);
        }
    );
  }

  private buildTableColumnNames(inventoryList: any[]) {
    var columnNames= [];

    columnNames[columnNames.length] = "";
    columnNames[columnNames.length] = "";
    columnNames[columnNames.length] = "Id";
    columnNames[columnNames.length] = "Name";
    columnNames[columnNames.length] = "Type";
    columnNames[columnNames.length] = "Price";
    columnNames[columnNames.length] = "Quantity";
    columnNames[columnNames.length] = "Description";


    for(let inventory of inventoryList) {
      for(let prop of inventory.props) {
        this.propMap.set(prop.name, prop.name);
      }
    }

    for(let key of Array.from( this.propMap.keys()) ) {
      columnNames[columnNames.length] = key;
    }

    this.tableColumnNames = columnNames;
  }

  private extractData(res:Response) {
    return res.json();
  }

  private handleError(error:any) {
    return Observable.throw(error);
  }

}
