import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-eventradar-item',
  templateUrl: './eventradar-item.component.html',
  styleUrls: ['./eventradar-item.component.scss']
})
export class EventradarItemComponent {
  @Input() name = '';
  @Input() startTime = '';
  @Input() endTime = '';
  @Input() location = '';
  @Input() organization = '';
  @Input() id = '';
}
