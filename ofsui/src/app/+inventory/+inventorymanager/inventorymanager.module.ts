import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {InventorymanagerComponent} from "./inventorymanager.component"
import {inventorymanagerRouting} from "./inventorymanager.routing"
import {SmartadminModule} from "../../shared/smartadmin.module";
import { InventorypropsComponent } from './inventoryprops/inventoryprops.component';
import { InventorycreateformComponent } from './inventorycreateform/inventorycreateform.component';
import { InventoryupdateformComponent } from './inventoryupdateform/inventoryupdateform.component';
import { InventorydatatableComponent } from './inventorydatatable/inventorydatatable.component';
import { InventorysearchformComponent } from './inventorysearchform/inventorysearchform.component';

@NgModule({
  imports: [
    SmartadminModule,
    CommonModule,
    inventorymanagerRouting,
  ],
  declarations: [InventorymanagerComponent, InventorypropsComponent, InventorycreateformComponent, InventoryupdateformComponent, InventorydatatableComponent, InventorysearchformComponent]
})
export class InventoryManagerModule { }

