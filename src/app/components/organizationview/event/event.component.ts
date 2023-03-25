import {Component, Input, OnInit} from '@angular/core';
import {OrganizationEventModel} from "../../../models/OrganizationEventModel";
import {map, Observable, share, Subject, Subscription, tap} from "rxjs";
import {RxStomp} from "@stomp/rx-stomp";
import {SocketService} from "../../../services/SocketService";
import {Message} from "@stomp/stompjs";
import {AuthService} from "../../../services/AuthService";
import {DataService} from "../../../services/DataService";


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit{

  constructor(private socketService : SocketService, private authService : AuthService, private dataService : DataService) {
    console.log(authService.authEmail)
  }

  socketValue : string = "";

  @Input() orgEvent? : OrganizationEventModel;
  @Input() orgId : string = '';

  chatSubscription? : Subscription;


  ngOnInit(): void {

  }

  annmelden() {
    console.log(this.authService.authEmail.toString())
    this.dataService.acceptEvent(this.orgId, this.orgEvent?.id || '', this.authService.authEmail.toString()).subscribe();
  }

  watchSocket() {
    this.chatSubscription = this.socketService.watch('/notifier/chat').subscribe((message: Message) => {
      this.socketValue = message.body;
    });
  }

  unWatchSocjet() {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe()
    }
  }

  //DANGER ZONE

  deleteEvent() {
    if (this.orgEvent?.id) {

      console.log("eid " + this.orgEvent.id + " orgId " + this.orgId)

      this.dataService.deleteEvent(this.orgId, this.orgEvent.id).subscribe(success => {
        console.log(success)
        window.location.reload()
      })

    }
  }

  abmelden() {

  }
}
