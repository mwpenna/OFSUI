import {Routes, RouterModule} from "@angular/router";

export const routes:Routes = [
  {
    path: 'layouts',
    loadChildren: 'app/+user/+form-layouts/form-layouts.module#FormLayoutsModule',
    data: {pageTitle: 'User'}
  },
  {
    path: 'table',
    loadChildren: 'app/+user/+userstable/userstable.module#UserstableModule',
    data: {pageTitle: 'User'}
  }
]

export const routing = RouterModule.forChild(routes);
