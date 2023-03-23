import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-organizationitem',
  templateUrl: './organization-item.component.html',
  styleUrls: ['./organization-item.component.scss']
})
export class OrganizationItemComponent {

  //TODO: combined INPUT with MODEL
  @Input() name = '';
  @Input() description = '';
  @Input() id = '';

}
