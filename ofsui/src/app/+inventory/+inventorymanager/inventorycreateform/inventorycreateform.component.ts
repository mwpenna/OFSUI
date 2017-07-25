import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";
import {TemplateAPIService} from "../../../core/api/templateapi.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";

@Component({
  selector: 'app-inventorycreateform',
  templateUrl: './inventorycreateform.component.html'
})
export class InventorycreateformComponent implements OnInit {

  @ViewChild('inventoryCreateModal') public inventoryCreateModal:ModalDirective;

  public name: string;
  public price: string;
  public type: string;
  public quantity: string;
  public description: string;

  public templateNameList: string[] = [];

  constructor(private templateAPI: TemplateAPIService) { }

  ngOnInit() {
  }

  public showCreateInventoryModal() {
    console.log("Inside show create inventory");
    this.getTemplatesByCompanyId();
    this.inventoryCreateModal.show();
  }

  public createInventory() {
    console.log("Inside create inventory");
    console.log(this.name);
    console.log(this.price);
    console.log(this.type);
    console.log(this.quantity);
    console.log(this.description);
  }

  private getTemplatesByCompanyId() {
    this.templateAPI.getTemplateByCompanyId()
        .map(this.extractData)
        .catch(this.handleError)
        .subscribe(
            result => {
              console.log(result);
              for(let template of result.items) {
                this.templateNameList.push(template.name)
              }
              console.log(this.templateNameList);
            },
            error => {
              console.log(error);
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
