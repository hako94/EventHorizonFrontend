import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChatModel} from "../../../../models/ChatModel";
import {SocketService} from "../../../../services/SocketService";
import {DataService} from "../../../../services/DataService";
import {DatePipe} from "@angular/common";
import {interval, of, Subscription} from "rxjs";
import {Message} from "@stomp/stompjs";
import {StorageService} from "../../../../services/StorageService";

@Component({
  selector: 'app-event-chat-view',
  templateUrl: './event-chat-view.component.html',
  styleUrls: ['./event-chat-view.component.scss']
})
export class EventChatViewComponent implements OnInit, OnDestroy {

  connected : boolean = false;

  @Input() orgaID = '';
  @Input() eventID = '';

  chatSubscription?: Subscription;
  chatMessages: string[] = [];
  private readonly MAX_CHAT_MESSAGES = 50;

  subscription : Subscription;

  constructor(private socketService: SocketService, private storageService: StorageService, private dataService: DataService, private datepipe: DatePipe) {
    const source = interval(900);
    const text = 'Your Text Here';
    this.subscription = source.subscribe(val => this.connected = !this.connected);
  }

  ngOnInit(): void {
    this.watchSocket()
    this.dataService.getChatHistory(this.orgaID, this.eventID).subscribe(success => {
      for (const chatMessage of success) {
        const formattedMessage = "[" + new DatePipe('de-DE').transform(chatMessage.timestamp, 'dd.MM.yyyy HH:mm:ss') + " | " + chatMessage.sender + "] " + chatMessage.message;
        this.chatMessages.push(formattedMessage);

        if (this.chatSubscription) {
          this.subscription.unsubscribe()
          this.connected = true;
        }
      }
    })

  }

  ngOnDestroy(): void {
    this.unWatchSocjet()
  }

  watchSocket() {
    this.chatSubscription = this.socketService.watch('/topic/' + this.orgaID + '/' + this.eventID).subscribe((message: Message) => {
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

  unWatchSocjet() {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe()
    }
  }

  //DANGER ZONE
  pushMessageToBackend(chat: string) {
    const model: ChatModel = {
      orgId: this.orgaID,
      eventId: this.eventID,
      message: chat
    }
    const message = JSON.stringify(model);
    this.socketService.publish({destination: '/app/events/chats', body: message});
  }

}
