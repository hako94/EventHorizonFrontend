import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
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
import { OrganizationmemberviewComponent } from './components/organizationview/organization-member-view/organizationmemberview.component';
import { OrganizationAddeventComponent } from './components/organizationview/organization-add-event/organization-addevent.component';
import { OrganizationSettingsComponent } from './components/organizationview/organization-settings/organization-settings.component';
import { EventItemComponent } from './components/organizationview/event-item/event-item.component';
import {rxStompServiceFactory, SocketService} from "./services/SocketService";
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
import {MatGridListModule} from "@angular/material/grid-list";
import { EventradarItemComponent } from './components/dashboard/eventradar-item/eventradar-item.component';
import {MatMenuModule} from "@angular/material/menu";
import { OrganizationinviteviewComponent } from './components/organizationview/organizationinviteview/organizationinviteview.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import { ResetPasswordComponent } from './components/login/reset-password/reset-password.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { OrganizationMailsViewComponent } from './components/organizationview/organization-mails-view/organization-mails-view.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from '@angular/material/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PlattformAdminComponent } from './components/plattform-admin/plattform-admin.component';
import {MatExpansionModule} from "@angular/material/expansion";
import { EventViewMainComponent } from './components/event-view/event-view-main/event-view-main.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { OrganizationAddMailComponent } from './components/organizationview/organization-add-mail/organization-add-mail.component';
import { InfoSnackbarComponent } from './components/organizationview/organization-mails-view/info-snackbar/info-snackbar.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {FilterPipe} from "./pipes/FilterPipe";
import { OrganizationPresetViewComponent } from './components/organizationview/organization-preset-view/organization-preset-view.component';
import { OrganizationEventDetailsViewComponent } from './components/organizationview/organization-event-details-view/organization-event-details-view.component';
import { EventDescriptionViewComponent } from './components/organizationview/organization-event-details-view/event-description-view/event-description-view.component';
import { EventChatViewComponent } from './components/organizationview/organization-event-details-view/event-chat-view/event-chat-view.component';
import { EventAttenderViewComponent } from './components/organizationview/organization-event-details-view/event-attender-view/event-attender-view.component';
import { EventInvitesViewComponent } from './components/organizationview/organization-event-details-view/event-invites-view/event-invites-view.component';
import { EventMailsettingsViewComponent } from './components/organizationview/organization-event-details-view/event-mailsettings-view/event-mailsettings-view.component';
import { EventFilesViewComponent } from './components/organizationview/organization-event-details-view/event-files-view/event-files-view.component';
import { EventSurveyComponent } from './components/organizationview/organization-event-details-view/event-survey/event-survey.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { EventAttendanceListViewComponent } from './components/organizationview/organization-event-details-view/event-attendance-list-view/event-attendance-list-view.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ErrorInterceptor} from "./interceptors/ErrorInterceptor";
import { DialogLoadingComponent } from './components/organizationview/organization-add-event/dialog-loading/dialog-loading.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatListModule} from "@angular/material/list";
import { DeletionConfirmationComponent } from './components/deletion-confirmation/deletion-confirmation.component';

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
    EventItemComponent,
    EventUserMangamentComponent,
    EventradarItemComponent,
    OrganizationinviteviewComponent,
    ResetPasswordComponent,
    OrganizationMailsViewComponent,
    PlattformAdminComponent,
    EventViewMainComponent,
    OrganizationAddMailComponent,
    InfoSnackbarComponent,
    FilterPipe,
    OrganizationPresetViewComponent,
    OrganizationEventDetailsViewComponent,
    EventDescriptionViewComponent,
    EventChatViewComponent,
    EventAttenderViewComponent,
    EventInvitesViewComponent,
    EventMailsettingsViewComponent,
    EventFilesViewComponent,
    EventSurveyComponent,
    EventAttendanceListViewComponent,
    DialogLoadingComponent,
    DeletionConfirmationComponent
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
        MatRadioModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatTabsModule,
        MatDividerModule,
        MatStepperModule,
        MatGridListModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgxDropzoneModule,
        MatExpansionModule,
        MatButtonToggleModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatAutocompleteModule,
        MatDialogModule,
        MatListModule,

    ],
  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
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
