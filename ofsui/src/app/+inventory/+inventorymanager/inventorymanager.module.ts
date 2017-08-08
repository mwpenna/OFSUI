import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {InventorymanagerComponent} from "./inventorymanager.component"
import {inventorymanagerRouting} from "./inventorymanager.routing"
import {SmartadminModule} from "../../shared/smartadmin.module";
import { InventorycreateformComponent } from './inventorycreateform/inventorycreateform.component';
import { InventoryupdateformComponent } from './inventoryupdateform/inventoryupdateform.component';
import { InventorydatatableComponent } from './inventorydatatable/inventorydatatable.component';
import { InventorysearchformComponent } from './inventorysearchform/inventorysearchform.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import { InventorypropssubcomponentComponent } from './inventorypropssubcomponent/inventorypropssubcomponent.component';

@NgModule({
  imports: [
    SmartadminModule,
    CommonModule,
    inventorymanagerRouting,
    SmartadminValidationModule,
    SmartadminInputModule,
    ReactiveFormsModule
  ],
  declarations: [InventorymanagerComponent, InventorycreateformComponent, InventoryupdateformComponent, InventorydatatableComponent, InventorysearchformComponent, InventorypropssubcomponentComponent]
})
export class InventoryManagerModule { }

