import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";

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

  constructor() { }

  ngOnInit() {
  }

  public showCreateInventoryModal() {
    console.log("Inside show create inventory");
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

}
