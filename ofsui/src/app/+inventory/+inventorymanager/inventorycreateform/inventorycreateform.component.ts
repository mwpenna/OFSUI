import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-inventorycreateform',
  templateUrl: './inventorycreateform.component.html'
})
export class InventorycreateformComponent implements OnInit {

  @ViewChild('inventoryCreateModal') public inventoryCreateModal:ModalDirective;

  constructor() { }

  ngOnInit() {
  }

  public showCreateInventoryModal() {
    console.log("Inside show create inventory");
    this.inventoryCreateModal.show();
  }

  public createInventory() {
    console.log("Inside create inventory");
  }

}
