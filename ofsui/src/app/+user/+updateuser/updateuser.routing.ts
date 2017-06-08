import {Routes, RouterModule} from "@angular/router";
import {UpdateUserComponent} from "./updateuser.component";

export const updateuserRoutes: Routes = [{
  path: '',
  component: UpdateUserComponent,
  data: {pageTitle: 'User Reports'}
}];

export const usertableRouting = RouterModule.forChild(updateuserRoutes);