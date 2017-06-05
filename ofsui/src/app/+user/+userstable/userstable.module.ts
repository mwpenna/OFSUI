import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserstableComponent } from './userstable.component';
import {usertableRouting} from "./userstable.routing";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {CompanyUserTableComponent} from "./companyuserstable/companyusertable.component";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";

@NgModule({
  imports: [
    SmartadminModule,
    CommonModule,
    usertableRouting,
    SmartadminDatatableModule
  ],
  declarations: [UserstableComponent, CompanyUserTableComponent]
})
export class UserstableModule { }
