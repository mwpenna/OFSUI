import {Routes, RouterModule} from "@angular/router";

export const routes:Routes = [
    {
        path: 'inventorymanager',
        loadChildren: 'app/+inventory/+inventorymanager/inventorymanager.module#InventoryManagerModule',
        data: {pageTitle: 'Inventory'}
    },
    {
        path: 'templatemanager',
        loadChildren: 'app/+inventory/+templatemanager/templatemanager.module#TemplateManagerModule',
        data: {pageTitle: 'Inventory'}
    }
]

export const routing = RouterModule.forChild(routes);