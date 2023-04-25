import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-eventradar-item',
  templateUrl: './eventradar-item.component.html',
  styleUrls: ['./eventradar-item.component.scss']
})
export class EventradarItemComponent {
  @Input() id : string = '';
  @Input() name : string = '';
  @Input() organizationId : string = '';
  @Input() organizationName : string = '';
  @Input() startTime : string = '';
  @Input() endTime : string = '';
  @Input() location : string = '';
  @Input() serial : boolean = false;
  @Input() organisator : boolean = false;
  @Input() tutor : boolean = false;
  @Input() attender : boolean = false;

  constructor(private router : Router) {
  }

  /**
   * routes to the description-view of the current event
   */
  routeToEvent() {
    this.router.navigate(['/organizations/' + this.organizationId + '/event/' + this.id + '/details'], {queryParams: {view: 'description'}});
  }
}
