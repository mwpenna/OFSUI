import { Component, OnInit } from '@angular/core';
import {InventoryAPIService} from "../../../core/api/inventoryapi.service";
import {InventorySearchService} from "./inventorysearch.service";
import {Subject, Observable} from "rxjs";
import {Response} from "@angular/http";
import {HttpExceptionHandler} from "../../../core/api/httpexceptionhandler";


@Component({
  selector: 'app-inventorysearchform',
  templateUrl: './inventorysearchform.component.html'
})
export class InventorysearchformComponent implements OnInit {

  public name;
  public type;
  public quantity;
  public price;
  public description;
  public propName;

  request: Subject<any> = new Subject<any>();

  constructor(private inventoryService: InventoryAPIService,
              private inventorySearchService: InventorySearchService,
              private httpExceptionHandler: HttpExceptionHandler,) { }

  ngOnInit() {
    this.inventorySearchService.setPageLimit(10);
    this.request
        .debounceTime(400)
        .distinctUntilChanged()
        .subscribe(
            request => {
              console.log(JSON.stringify(request));
              this.inventorySearchService.setRequest(request);
              this.inventoryService.search(request, this.inventorySearchService.getPageLimit(), 0)
                  .map(this.extractData)
                  .catch(this.handleError)
                  .subscribe(
                      result => {
                        console.log(result);
                        this.inventorySearchService.announceSearchResults(result);
                      },
                      error => {
                        this.httpExceptionHandler.handleException(error);
                      }
                  );
            }
        )
  }

  public changed(text: string) {
    this.request.next(this.generateRequest());
  }

  private generateRequest(): any {
    this.setEmptyStringsToUndefined();

    var requestPrice = undefined;
    if(this.price != null && this.price != undefined) {
      requestPrice = Number(this.price);
    }

    var requestQuantity = undefined;
    if(this.quantity != null && this.quantity != undefined) {
      requestQuantity = Number(this.quantity)
    }

    if(this.propName != null && this.propName != "") {
      return {
        name: this.name,
        type: this.type,
        price: requestPrice,
        quantity: requestQuantity,
        props: this.generatePropsForRequest()
      }
    }
    else {
      return {
        name: this.name,
        type: this.type,
        price: requestPrice,
        quantity: requestQuantity,
      }
    }

  }

  private generatePropsForRequest(): any[] {
    var props = [];

    props.push(
        {
            name: this.propName
        }
    )

    return props;
  }

  private setEmptyStringsToUndefined(): void {
    if(this.name === "") {
      this.name = undefined;
    }

    if(this.propName === "") {
      this.propName = undefined;
    }

    if(this.type === "") {
      this.type = undefined;
    }

    if(this.quantity === "") {
      this.quantity = undefined;
    }

    if(this.price === "") {
      this.price = undefined;
    }

    if(this.description === "") {
      this.description = undefined;
    }
  }

  private extractData(res:Response) {
    return res.json();
  }

  private handleError(error:any) {
    return Observable.throw(error);
  }

}
