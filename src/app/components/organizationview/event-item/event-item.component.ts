import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {OrganizationEventModel} from "../../../models/OrganizationEventModel";
import {Subscription} from "rxjs";
import {SocketService} from "../../../services/SocketService";
import {Message} from "@stomp/stompjs";
import {DataService} from "../../../services/DataService";
import {StorageService} from "../../../services/StorageService";
import {ChatModel} from "../../../models/ChatModel";
import {ChatHistoryModel} from "../../../models/ChatHistoryModel";
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-event',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss']
})
export class EventItemComponent implements OnInit, OnDestroy {

  constructor(private socketService: SocketService, private storageService: StorageService, private dataService: DataService, private datepipe: DatePipe) {

  }

  socketValue: string = "";

  @Input() orgEvent?: OrganizationEventModel;
  @Input() orgId: string = '';

  @Input() mock : boolean = false;

  chatSubscription?: Subscription;
  chatMessages: string[] = [];
  private readonly MAX_CHAT_MESSAGES = 50;

  ngOnInit(): void {
    console.warn(this.orgEvent)
    this.watchSocket()
    this.dataService.getChatHistory(this.orgId, this.orgEvent?.id).subscribe(success => {
      for (const chatMessage of success) {
        const formattedMessage = "\"[" + new DatePipe('de-DE').transform(chatMessage.timestamp, 'dd.MM.yyyy HH:mm:ss') + " | " + chatMessage.sender + "]\" " + chatMessage.message;
        this.chatMessages.push(formattedMessage);
      }
    })

  }

  ngOnDestroy(): void {
    this.unwatchSocket()
  }

  book() {
    console.log(this.storageService.getEmail())
    this.dataService.acceptEvent(this.orgId, this.orgEvent?.id || '', this.storageService.getEmail())
      .subscribe(success => {
        if (success.status == 200) {
          if (this.orgEvent) {
            this.orgEvent.attender = true;
          }
        }
    });
  }

  signOff() {
    this.dataService.leaveEvent(this.orgId, this.orgEvent?.id || '', this.storageService.getEmail())
      .subscribe(success => {
        if (success.status == 204) {
          if (this.orgEvent) {
            this.orgEvent.attender = false;
          }
        }
    });
  }

  watchSocket() {
    this.chatSubscription = this.socketService.watch('/topic/' + this.orgId + '/' + this.orgEvent?.id).subscribe((message: Message) => {
      //this.socketValue = message.body;
      this.addChatMessage(message.body);
    });
  }

  addChatMessage(message: string) {
    this.chatMessages.push(message); // Fügt die neue Nachricht am Ende des Arrays an
    if (this.chatMessages.length > this.MAX_CHAT_MESSAGES) {
      this.chatMessages.shift(); // Entfernt die älteste Nachricht, wenn das Array die maximale Größe erreicht
    }
  }

  unwatchSocket() {
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

  pushMessageToBackend(chat: string) {
    const model: ChatModel = {
      orgId: this.orgId,
      eventId: this.orgEvent?.id,
      message: chat
    }
    const message = JSON.stringify(model);
    this.socketService.publish({destination: '/app/events/chats', body: message});
  }

  /*  pushMessageToBackend1(chat : string) {
      const model : ChatModel = {
        message: chat
      }

      this.dataService.sendChat(this.orgId,this.orgEvent?.id, model).subscribe();
    }*/
}
