import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileComponent} from './profile.component';
import {SmartadminLayoutModule} from "../../shared/layout/layout.module";
import {StatsModule} from "../../shared/stats/stats.module";
import {XEditableWidgetComponent} from "./x-editable-widget/x-editable-widget.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {XEditableService} from "../../shared/forms/input/x-editable.service";

@NgModule({
  imports: [
    CommonModule,
    SmartadminLayoutModule,
    StatsModule,
    ProfileRoutingModule,
    SmartadminModule,
    SmartadminInputModule
  ],
  declarations: [ProfileComponent, XEditableWidgetComponent]
})
export class ProfileModule {
}
