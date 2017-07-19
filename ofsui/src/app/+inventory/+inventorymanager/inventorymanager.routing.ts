import { Routes, RouterModule } from '@angular/router';
import {InventorymanagerComponent} from './inventorymanager.component'

export const inventorymanagerRoutes: Routes = [{
  path: '',
  component: InventorymanagerComponent,
  data: {pageTitle: 'Inventory Manager'}
}];

export const inventorymanagerRouting = RouterModule.forChild(inventorymanagerRoutes);
