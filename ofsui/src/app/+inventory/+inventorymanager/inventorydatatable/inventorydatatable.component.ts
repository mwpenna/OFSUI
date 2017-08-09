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

  public items: any[];
  public tableColumnNames: string[] = [];
  public propMap : Map<string, number> = new Map<string, number>();

  public count = 0;
  public numPages: number[];
  public maxPage: number;
  public selectedPage:number=1;
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
          this.buildTableColumnNames(results.items);
          this.buildItemList(results.items);
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

      items[itemLocation] = data
      itemLocation++
    }

    this.items = items;
  }

  private mapProps(data: any[], inventory: any) {
    for(let prop of inventory.props) {
      if(this.propMap.has(prop.name)) {
        data[this.propMap.get(prop.name)] = prop.value;
      }
    }
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

    var spot = 7;
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

  private extractData(res:Response) {
    return res.json();
  }

  private handleError(error:any) {
    return Observable.throw(error);
  }

}
