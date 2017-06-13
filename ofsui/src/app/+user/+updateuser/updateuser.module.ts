import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateUserComponent } from './updateuser.component';
import {usertableRouting} from "./updateuser.routing";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";
import { SearchformComponent } from './searchform/searchform.component';
import { UserresulttableComponent } from './userresulttable/userresulttable.component';

@NgModule({
  imports: [
    SmartadminModule,
    CommonModule,
    usertableRouting,
    SmartadminDatatableModule
  ],
  declarations: [UpdateUserComponent, SearchformComponent, UserresulttableComponent]
})
export class UpdateUserModule { }
