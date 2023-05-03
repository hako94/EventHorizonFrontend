import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {StorageService} from "../../services/StorageService";

@Component({
  selector: 'app-organizationview',
  templateUrl: './organizationview.component.html',
  styleUrls: ['./organizationview.component.scss']
})
export class OrganizationviewComponent implements OnInit{

  eventViewParam : Params = {'view' : 'events'};
  memberViewParam : Params = {'view' : 'member'};
  invitesViewParam : Params = {'view' : 'invites'};
  mailsViewParam : Params = {'view' : 'mails'};
  settingsViewParam : Params = {'view' : 'settings'};
  presetViewParam : Params = {'view' : 'presetView'};
  currentOrganization : string = '';

  currentParam? : Params;

  constructor(private location : Location, private router : Router, private activatedRoute : ActivatedRoute, private storageService : StorageService) {

    let orga = this.location.path().split('/').at(2)?.toString()

    if (orga) {
      if (orga.indexOf('?') > 0) {
        this.currentOrganization = orga.slice(0,orga.indexOf('?'));
      } else {
        this.currentOrganization = orga;
      }
    } else {
      this.currentOrganization = '';
    }
  }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {

      //TODO direkte Übersetzung ohne if / else Block
      if (params['view'] == "mails")
        this.currentParam = this.mailsViewParam;
      else if (params['view'] == "events")
        this.currentParam = this.eventViewParam;
      else if (params['view'] == "member")
        this.currentParam = this.memberViewParam;
      else if (params['view'] == "invites")
        this.currentParam = this.invitesViewParam;
      else if (params['view'] == "presetView")
        this.currentParam = this.presetViewParam;
      else if (params['view'] == "settings")
        this.currentParam = this.settingsViewParam;
    });
  }

  updateURLWithParam(param : Params) : void {

    console.log(this.currentParam)

    this.currentParam = param;

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: this.currentParam,
        queryParamsHandling: 'merge',
      });

    console.log(this.currentParam)
  }

  /**
   * Checks if the current user has the given role in the current organization
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
