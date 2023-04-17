import { Component } from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-organizationview',
  templateUrl: './organizationview.component.html',
  styleUrls: ['./organizationview.component.scss']
})
export class OrganizationviewComponent {

  eventViewParam : Params = {'view' : 'events'};

  memberViewParam : Params = {'view' : 'member'};
  invitesViewParam : Params = {'view' : 'invites'};
  upcommingViewParam : Params = {'view' : 'upcomming'};
  presetViewParam : Params = {'view' : 'presetView'};
  settingsViewParam : Params = {'view' : 'settings'};
  currentOrganization : string = '';

  currentParam : Params = this.eventViewParam;

  constructor(private location : Location, private router : Router, private activatedRoute : ActivatedRoute) {

    let orga = this.location.path().split('/').at(2)?.toString()

    if (orga) {
      console.log("Orga index " + orga.indexOf('?'))

      if (orga.indexOf('?') > 0) {
        this.currentOrganization = orga.slice(0,orga.indexOf('?'));
      } else {
        this.currentOrganization = orga;
      }
    } else {
      this.currentOrganization = '';
    }

    console.log(this.currentOrganization)

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: this.eventViewParam,
        queryParamsHandling: 'merge',
      });
  }

  updateURLWithParam(param : Params) : void {

    this.currentParam = param;

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: this.currentParam,
        queryParamsHandling: 'merge',
      });
  }

}
