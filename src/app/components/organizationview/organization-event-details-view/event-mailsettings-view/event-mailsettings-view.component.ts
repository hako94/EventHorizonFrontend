import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-event-mailsettings-view',
  templateUrl: './event-mailsettings-view.component.html',
  styleUrls: ['./event-mailsettings-view.component.scss']
})
export class EventMailsettingsViewComponent {

  @Input() orgaID = '';
  @Input() eventID = '';
}
