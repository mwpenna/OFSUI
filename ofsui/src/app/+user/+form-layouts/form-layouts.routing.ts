import { Routes, RouterModule } from '@angular/router';
import {FormLayoutsComponent} from "./form-layouts.component";

export const formLayoutsRoutes: Routes = [{
  path: '',
  component: FormLayoutsComponent,
  data: {pageTitle: 'Registration'}
}];

export const formLayoutsRouting = RouterModule.forChild(formLayoutsRoutes);

