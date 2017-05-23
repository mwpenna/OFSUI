import {NgModule} from '@angular/core';

import {RegistrationFormComponent} from "./registration-form";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {FormLayoutsComponent} from "./form-layouts.component";
import {formLayoutsRouting} from "./form-layouts.routing";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";

@NgModule({
  imports: [
    SmartadminModule,

    formLayoutsRouting,
    SmartadminValidationModule,
    SmartadminInputModule
  ],
  declarations: [RegistrationFormComponent, FormLayoutsComponent
  ],
})
export class FormLayoutsModule {}
