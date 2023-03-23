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
  upcommingViewParam : Params = {'view' : 'upcomming'};
  presetViewParam : Params = {'view' : 'presetView'};

  currentOrganization : string = '';

  constructor(private location : Location, private router : Router, private activatedRoute : ActivatedRoute) {

    let orga = this.location.path().split('/').at(2)?.toString()

    if (orga) {
      this.currentOrganization = orga.slice(0,orga.indexOf('?'));
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
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: param,
        queryParamsHandling: 'merge',
      });
  }

}
