import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from "./components/register/register.component";
import {LoginComponent} from "./components/login/login.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {OrganizationviewComponent} from "./components/organizationview/organizationview.component";
import {
  OrganizationAddeventComponent
} from "./components/organizationview/organization-addevent/organization-addevent.component";
import {
  EventQuestionnairesComponent
} from "./components/organizationview/event-questionnaires/event-questionnaires.component";

const routes: Routes = [
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent},
  { path: "organizations/:id/event/:eventid/questionnaires", component: EventQuestionnairesComponent},
  { path: "organizations/:id", component: OrganizationviewComponent},
  { path: "organizations/:id/addEvent", component: OrganizationAddeventComponent},
  { path: '**', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
