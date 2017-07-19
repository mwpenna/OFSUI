import { Routes, RouterModule } from '@angular/router';
import {TemplatemanagerComponent} from './templatemanager.component'

export const templatemanagerRoutes: Routes = [{
  path: '',
  component: TemplatemanagerComponent,
  data: {pageTitle: 'Template Manager'}
}];

export const templatemanagerRouting = RouterModule.forChild(templatemanagerRoutes);
