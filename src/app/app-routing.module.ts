import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from "./components/register/register.component";
import {LoginComponent} from "./components/login/login.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {OrganizationviewComponent} from "./components/organizationview/organizationview.component";
import {OrganizationAddeventComponent} from "./components/organizationview/organization-add-event/organization-addevent.component";
import {EventUserMangamentComponent} from "./components/organizationview/event-user-mangament/event-user-mangament.component";
import {PlattformAdminComponent} from "./components/plattform-admin/plattform-admin.component";
import {OrganizationAddMailComponent} from "./components/organizationview/organization-add-mail/organization-add-mail.component";
import {OrganizationEventDetailsViewComponent} from "./components/organizationview/organization-event-details-view/organization-event-details-view.component";
import {ResetPasswordComponent} from "./components/login/reset-password/reset-password.component";
import {ImpressumComponent} from "./components/header/impressum/impressum.component";

const routes: Routes = [
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "resetpassword", component: ResetPasswordComponent },
  { path: "platform-settings", component: PlattformAdminComponent },
  { path: "dashboard", component: DashboardComponent},
  { path: "impressum", component: ImpressumComponent},
  { path: "organizations/:id/event/:eventid/eventusermanagment", component: EventUserMangamentComponent},
  { path: "organizations/:id/event/:eventid/details", component: OrganizationEventDetailsViewComponent},
  { path: "organizations/:id", component: OrganizationviewComponent},
  { path: "organizations/:id/addEvent", component: OrganizationAddeventComponent},
  { path: "organizations/:id/addMail", component: OrganizationAddMailComponent},
  { path: '**', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
