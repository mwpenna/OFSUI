import {Routes, RouterModule} from "@angular/router";

export const routes:Routes = [
  {
    path: 'login',
    loadChildren: './+login/login.module#LoginModule'
  },
  {
    path: 'forgot-password',
    loadChildren: './+forgot/forgot.module#ForgotModule'
  },
];

export const routing = RouterModule.forChild(routes);
