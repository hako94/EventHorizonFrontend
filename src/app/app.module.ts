import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {httpInterceptorProviders} from "./interceptors/BearerInterceptor";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {OrganizationItemComponent} from "./components/dashboard/organization-item/organization-item.component";
import {OrganizationviewComponent} from "./components/organizationview/organizationview.component";
import {
  OrganizationEventViewComponent
} from "./components/organizationview/organization-event-view/organization-event-view.component";
import { OrganizationmemberviewComponent } from './components/organizationview/organizationmemberview/organizationmemberview.component';
import { OrganizationAddeventComponent } from './components/organizationview/organization-addevent/organization-addevent.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    OrganizationItemComponent,
    OrganizationviewComponent,
    OrganizationEventViewComponent,
    HeaderComponent,
    OrganizationmemberviewComponent,
    OrganizationAddeventComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatToolbarModule,
    ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
