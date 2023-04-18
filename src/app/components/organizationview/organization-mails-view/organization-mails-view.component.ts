import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-organization-mails-view',
  templateUrl: './organization-mails-view.component.html',
  styleUrls: ['./organization-mails-view.component.scss']
})
export class OrganizationMailsViewComponent {
  @Input() orgaID = '';

  availableEmailTemplates : any[] = [];
}
