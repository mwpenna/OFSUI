import {Component, OnInit, ViewChild} from '@angular/core';
import {InventoryAPIService} from "../../../core/api/inventoryapi.service";
import {HttpExceptionHandler} from "../../../core/api/httpexceptionhandler";
import {InventorySearchService} from "../inventorysearchform/inventorysearch.service";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, FormControl} from "@angular/forms";
import {ModalDirective} from "ngx-bootstrap";

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

  @ViewChild('lgModal') public lgModal:ModalDirective;

  constructor( private inventoryService: InventoryAPIService,
               private httpExceptionHandler: HttpExceptionHandler,
               private inventorySearchService: InventorySearchService,
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

  public showUpdateInventoryModal(inventoryIndex:number) {
    this.createAndResetForm();
    this.inventoryId = this.resultList[inventoryIndex].id;
    this.createUpdateForm(inventoryIndex);
    this.lgModal.show();
  }

  private createUpdateForm(inventoryIndex: number) {
    let newForm = this.fb.group({
      name: new FormControl(),
      price: new FormControl(),
      type: new FormControl(),
      quantity: new FormControl(),
      description: new FormControl(),
      formArray: this.fb.array([]),
    })

    this.myForm = newForm;
  }

  private createAndResetForm() {
    let newForm = this.fb.group({
      formArray: this.fb.array([])
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
