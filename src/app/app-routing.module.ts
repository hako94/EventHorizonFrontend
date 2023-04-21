import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from "./components/register/register.component";
import {LoginComponent} from "./components/login/login.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {OrganizationviewComponent} from "./components/organizationview/organizationview.component";
import {
  OrganizationAddeventComponent
} from "./components/organizationview/organization-add-event/organization-addevent.component";
import {
  EventQuestionnairesComponent
} from "./components/organizationview/event-questionnaires/event-questionnaires.component";
import {
  EventUserMangamentComponent
} from "./components/organizationview/event-user-mangament/event-user-mangament.component";
import {PlattformAdminComponent} from "./components/plattform-admin/plattform-admin.component";
import {
  OrganizationAddMailComponent
} from "./components/organizationview/organization-add-mail/organization-add-mail.component";

const routes: Routes = [
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "platform-settings", component: PlattformAdminComponent },
  { path: "dashboard", component: DashboardComponent},
  { path: "organizations/:id/event/:eventid/questionnaires", component: EventQuestionnairesComponent},
  { path: "organizations/:id/event/:eventid/eventusermanagment", component: EventUserMangamentComponent},
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
