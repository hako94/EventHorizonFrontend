import {Component, Input, OnInit} from '@angular/core';
import {OrganizationEventModel} from "../../../models/OrganizationEventModel";
import {map, Observable, share, Subject, tap} from "rxjs";
import {RxStomp} from "@stomp/rx-stomp";
import {SocketService} from "../../../services/SocketService";
import {Message} from "@stomp/stompjs";


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit{

  constructor(private socketService : SocketService) {
  }

  socketValue : string = "";

  @Input() orgEvent? : OrganizationEventModel;


  ngOnInit(): void {
    this.socketService.watch('/notifier/test').subscribe((message: Message) => {
      console.log(message.body)
      this.socketValue = message.body;
    });
  }


  connect() {

  }
}
