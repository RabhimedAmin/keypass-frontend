import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MODULE_COMPONENTS, MODULE_ROUTES } from './dashboard.routes';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { UsersRequestPipe } from './pipes/request.pipe';
import { UnusedResourcesPipe } from './pipes/unused.resources.pipe';
@NgModule({
    imports: [
        RouterModule.forChild(MODULE_ROUTES),
        CommonModule,
        FormsModule,
        BrowserModule,
        NguiDatetimePickerModule
    ],
    declarations: [ MODULE_COMPONENTS, UsersRequestPipe, UnusedResourcesPipe ]
})

export class DashboardModule{}
