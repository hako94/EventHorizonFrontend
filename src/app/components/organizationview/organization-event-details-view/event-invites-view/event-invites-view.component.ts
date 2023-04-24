import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-event-invites-view',
  templateUrl: './event-invites-view.component.html',
  styleUrls: ['./event-invites-view.component.scss']
})
export class EventInvitesViewComponent {

  @Input() orgaID = '';
  @Input() eventID = '';
}
