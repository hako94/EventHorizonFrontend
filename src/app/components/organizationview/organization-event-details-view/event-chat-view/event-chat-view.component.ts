import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-event-chat-view',
  templateUrl: './event-chat-view.component.html',
  styleUrls: ['./event-chat-view.component.scss']
})
export class EventChatViewComponent {

  @Input() orgaID = '';
  @Input() eventID = '';
}
