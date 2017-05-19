import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'error404'
  },
  {
    path: 'error404',
    loadChildren: './+error404/error404.module#Error404Module'
  },
];

export const routing = RouterModule.forChild(routes);




