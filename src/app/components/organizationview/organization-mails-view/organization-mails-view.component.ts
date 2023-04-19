import {Component, Input} from '@angular/core';
import {EmailTemplateModel} from "../../../models/EmailTemplateModel";

@Component({
  selector: 'app-organization-mails-view',
  templateUrl: './organization-mails-view.component.html',
  styleUrls: ['./organization-mails-view.component.scss']
})
export class OrganizationMailsViewComponent {
  @Input() orgaID = '';

  availableEmailTemplates : EmailTemplateModel[] = [];
  panelOpenState: boolean = false;
}
