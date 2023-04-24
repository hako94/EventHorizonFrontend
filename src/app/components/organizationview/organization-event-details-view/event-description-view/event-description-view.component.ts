import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-event-description-view',
  templateUrl: './event-description-view.component.html',
  styleUrls: ['./event-description-view.component.scss']
})
export class EventDescriptionViewComponent {

  @Input() orgaID = '';
  @Input() eventID = '';
}
