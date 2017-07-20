import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TemplatemanagerComponent} from "./templatemanager.component"
import {TemplatecreateformComponent} from "./templatecreateform/templatecreateform.component"
import {templatemanagerRouting} from "./templatemanager.routing"
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import { PropertyfromsubcompoentComponent } from './templatecreateform/propertyfromsubcompoent/propertyfromsubcompoent.component';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    SmartadminModule,
    CommonModule,
    templatemanagerRouting,
    SmartadminValidationModule,
    SmartadminInputModule,
    ReactiveFormsModule
  ],
  declarations: [TemplatemanagerComponent, TemplatecreateformComponent, PropertyfromsubcompoentComponent]
})

export class TemplateManagerModule { }

