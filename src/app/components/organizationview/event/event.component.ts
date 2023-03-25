import {Component, Input, OnInit} from '@angular/core';
import {OrganizationEventModel} from "../../../models/OrganizationEventModel";
import {map, Observable, share, Subject, Subscription, tap} from "rxjs";
import {RxStomp} from "@stomp/rx-stomp";
import {SocketService} from "../../../services/SocketService";
import {Message} from "@stomp/stompjs";
import {AuthService} from "../../../services/AuthService";
import {DataService} from "../../../services/DataService";
import {StorageService} from "../../../services/Storage";


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit{

  constructor(private socketService : SocketService, private storageService : StorageService, private dataService : DataService) {

  }

  socketValue : string = "";

  @Input() orgEvent? : OrganizationEventModel;
  @Input() orgId : string = '';

  chatSubscription? : Subscription;


  ngOnInit(): void {
    console.warn(this.orgEvent)
  }

  annmelden() {
    console.log(this.storageService.getEmail())
    this.dataService.acceptEvent(this.orgId, this.orgEvent?.id || '', this.storageService.getEmail()).subscribe();
    window.location.reload()
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

  signout() {
    this.dataService.leaveEvent(this.orgId, this.orgEvent?.id || '', this.storageService.getEmail()).subscribe();
    window.location.reload()
  }

  pushMessageToBackend(message : string) {
    this.socketService.publish({ destination: '/app/notifier/message', body: '{"message": "' + message + '"}' });
  }
}
