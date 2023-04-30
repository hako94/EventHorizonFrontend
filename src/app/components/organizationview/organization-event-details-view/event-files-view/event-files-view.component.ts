import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-event-files-view',
  templateUrl: './event-files-view.component.html',
  styleUrls: ['./event-files-view.component.scss']
})
export class EventFilesViewComponent {

  @Input() orgaID = '';
  @Input() eventID = '';
  @Input() roleIdInEvent!: number;

}
