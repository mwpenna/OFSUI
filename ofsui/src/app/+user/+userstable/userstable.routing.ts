import {Routes, RouterModule} from "@angular/router";
import {UserstableComponent} from "./userstable.component";

export const userstableRoutes: Routes = [{
  path: '',
  component: UserstableComponent,
  data: {pageTitle: 'User List'}
}];

export const usertableRouting = RouterModule.forChild(userstableRoutes);