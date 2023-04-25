import { Component } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Location} from "@angular/common";
import {StorageService} from "../../../services/StorageService";

@Component({
  selector: 'app-organization-event-details-view',
  templateUrl: './organization-event-details-view.component.html',
  styleUrls: ['./organization-event-details-view.component.scss']
})
export class OrganizationEventDetailsViewComponent {

  descriptionViewParam : Params = {'view' : 'description'};
  surveyViewParam : Params = {'view': 'survey'}
  chatViewParam : Params = {'view' : 'chat'};
  filesViewParam : Params = {'view' : 'files'};
  attenderViewParam : Params = {'view' : 'attender'};
  invitesViewParam : Params = {'view' : 'invites'};
  mailsViewParam : Params = {'view' : 'mails'};
  currentOrganization : string = '';
  currentEvent : string = '';

  currentParam? : Params;

  constructor(private location : Location, private router : Router, private activatedRoute : ActivatedRoute, private storageService : StorageService) {

    let orga = this.location.path().split('/').at(2)?.toString();

    if (orga) {
      if (orga.indexOf('?') > 0) {
        this.currentOrganization = orga.slice(0,orga.indexOf('?'));
      } else {
        this.currentOrganization = orga;
      }
    } else {
      this.currentOrganization = '';
    }

    let event = this.location.path().split('/').at(4)?.toString();

    if (event) {
      if (event.indexOf('?') > 0) {
        this.currentEvent = event.slice(0,event.indexOf('?'));
      } else {
        this.currentEvent = event;
      }
    } else {
      this.currentEvent = '';
    }
  }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {

      //TODO direkte Übersetzung ohne if / else Block
      if (params['view'] == "description")
        this.currentParam = this.descriptionViewParam;
      else if (params['view'] == "survey")
        this.currentParam = this.surveyViewParam;
      else if (params['view'] == "chat")
        this.currentParam = this.chatViewParam;
      else if (params['view'] == "files")
        this.currentParam = this.filesViewParam;
      else if (params['view'] == "attender")
        this.currentParam = this.attenderViewParam;
      else if (params['view'] == "invites")
        this.currentParam = this.invitesViewParam;
      else if (params['view'] == "mails")
        this.currentParam = this.mailsViewParam;
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
    return this.storageService.getRoleInCurrentOrganization(this.currentOrganization) == roleId;
  }
}
