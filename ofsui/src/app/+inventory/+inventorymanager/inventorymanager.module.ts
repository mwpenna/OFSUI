import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {InventorymanagerComponent} from "./inventorymanager.component"
import {inventorymanagerRouting} from "./inventorymanager.routing"
import {SmartadminModule} from "../../shared/smartadmin.module";

@NgModule({
  imports: [
    SmartadminModule,
    CommonModule,
    inventorymanagerRouting,
  ],
  declarations: [InventorymanagerComponent]
})
export class InventoryManagerModule { }

