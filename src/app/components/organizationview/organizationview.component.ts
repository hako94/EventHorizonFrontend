import { Component } from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {StorageService} from "../../services/StorageService";

@Component({
  selector: 'app-organizationview',
  templateUrl: './organizationview.component.html',
  styleUrls: ['./organizationview.component.scss']
})
export class OrganizationviewComponent {

  eventViewParam : Params = {'view' : 'events'};

  memberViewParam : Params = {'view' : 'member'};
  invitesViewParam : Params = {'view' : 'invites'};
  mailsViewParam : Params = {'view' : 'mails'};
  settingsViewParam : Params = {'view' : 'settings'};
  upcommingViewParam : Params = {'view' : 'upcomming'};
  presetViewParam : Params = {'view' : 'presetView'};
  currentOrganization : string = '';

  currentParam : Params = this.eventViewParam;

  constructor(private location : Location, private router : Router, private activatedRoute : ActivatedRoute, private storageService : StorageService) {

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

  /**
   * Überprüft, ob der aktuelle Benutzer die übergebene Rolle in der Organisation besitzt
   *
   * @param role
   */
  hasRole(roleId: number) : boolean {
    if (this.storageService.getRoleInCurrentOrganization(this.currentOrganization) == roleId) {
      return true;
    } else {
      return false;
    }
  }
}
