import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TemplatemanagerComponent} from "./templatemanager.component"
import {templatemanagerRouting} from "./templatemanager.routing"
import {SmartadminModule} from "../../shared/smartadmin.module";

@NgModule({
  imports: [
    SmartadminModule,
    CommonModule,
    templatemanagerRouting,
  ],
  declarations: [TemplatemanagerComponent]
})
export class TemplateManagerModule { }

