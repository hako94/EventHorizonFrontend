import {LOCALE_ID, NgModule} from '@angular/core';
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
import {DatePipe, registerLocaleData} from "@angular/common";
import {StorageService} from "./services/StorageService";
import localeDe from '@angular/common/locales/de';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatRadioModule} from "@angular/material/radio";
import { EventUserMangamentComponent } from './components/organizationview/event-user-mangament/event-user-mangament.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDividerModule} from "@angular/material/divider";
import {MatStepperModule} from "@angular/material/stepper";

registerLocaleData(localeDe);

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
    EventQuestionnairesComponent,
    EventUserMangamentComponent
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
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatStepperModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' },
    httpInterceptorProviders,
    DatePipe,
    {
      provide: SocketService,
      useFactory: rxStompServiceFactory,
    },
    StorageService,
    {
      provide: SocketService,
      useFactory: rxStompServiceFactory,
      deps: [StorageService],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
