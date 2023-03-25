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
import { OrganizationSettingsComponent } from './components/organizationview/organization-settings/organization-settings.component';
import { EventComponent } from './components/organizationview/event/event.component';
import {RxStomp} from "@stomp/rx-stomp";
import {rxStompServiceFactory, SocketService} from "./services/SocketService";
import { EventQuestionnairesComponent } from './components/organizationview/event-questionnaires/event-questionnaires.component';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";

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
    OrganizationAddeventComponent,
    OrganizationSettingsComponent,
    EventComponent,
    EventQuestionnairesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  providers: [
    httpInterceptorProviders,
    {
      provide: SocketService,
      useFactory: rxStompServiceFactory,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
