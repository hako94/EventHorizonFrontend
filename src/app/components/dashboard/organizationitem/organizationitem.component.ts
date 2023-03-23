import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-organizationitem',
  templateUrl: './organizationitem.component.html',
  styleUrls: ['./organizationitem.component.scss']
})
export class OrganizationitemComponent {

  //TODO: combined INPUT with MODEL
  @Input() name = '';
  @Input() description = '';
  @Input() id = '';

}
