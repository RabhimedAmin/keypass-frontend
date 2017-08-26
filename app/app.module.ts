import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HomeService } from './providers/home.service';
import { AppComponent }   from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonModule } from '@angular/common';

import { DashboardModule } from './dashboard/dashboard.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
    imports:      [
        BrowserModule,
        SidebarModule,
        NavbarModule,
        DashboardModule,
        FooterModule,
        RouterModule.forRoot([]),
        HttpModule,
        CommonModule,
        FormsModule
    ],
    declarations: [ AppComponent, DashboardComponent ],
    providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, HomeService],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }