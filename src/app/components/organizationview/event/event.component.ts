import {Component, Input, OnInit} from '@angular/core';
import {OrganizationEventModel} from "../../../models/OrganizationEventModel";
import {map, Observable, share, Subject, tap} from "rxjs";
import {RxStomp} from "@stomp/rx-stomp";
import {SocketService} from "../../../services/SocketService";


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit{

  constructor(private socketService : SocketService) {
  }


  @Input() orgEvent? : OrganizationEventModel;


  ngOnInit(): void {

  }

  connect() {
    this.socketService.connect()
  }
}
