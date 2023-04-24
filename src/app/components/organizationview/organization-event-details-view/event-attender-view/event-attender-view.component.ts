import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-event-attender-view',
  templateUrl: './event-attender-view.component.html',
  styleUrls: ['./event-attender-view.component.scss']
})
export class EventAttenderViewComponent {

  @Input() orgaID = '';
  @Input() eventID = '';
}
