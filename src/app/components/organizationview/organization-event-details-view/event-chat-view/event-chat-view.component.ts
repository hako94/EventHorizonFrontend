import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChatModel} from "../../../../models/ChatModel";
import {ChatAnswerModel} from "../../../../models/ChatAnswerModel";
import {SocketService} from "../../../../services/SocketService";
import {DataService} from "../../../../services/DataService";
import {DatePipe} from "@angular/common";
import {interval, Subscription} from "rxjs";
import {Message} from "@stomp/stompjs";
import {StorageService} from "../../../../services/StorageService";

@Component({
  selector: 'app-event-chat-view',
  templateUrl: './event-chat-view.component.html',
  styleUrls: ['./event-chat-view.component.scss']
})
export class EventChatViewComponent implements OnInit, OnDestroy {

  connected: boolean = false;

  @Input() orgaID = '';
  @Input() eventID = '';
  @Input() roleIdInEvent!: number;

  chatSubscription?: Subscription;
  chatMessages: ChatAnswerModel[] = [];
  private readonly MAX_CHAT_MESSAGES = 50;

  subscription: Subscription;

  constructor(private socketService: SocketService, private storageService: StorageService, private dataService: DataService, private datepipe: DatePipe) {
    const source = interval(900);
    const text = 'Your Text Here';
    this.subscription = source.subscribe(val => this.connected = !this.connected);
  }

  ngOnInit(): void {
    this.watchSocket()
    this.dataService.getChatHistory(this.orgaID, this.eventID).subscribe(success => {
      for (const chatMessage of success) {
        const chatAnswer: ChatAnswerModel = {
          priority: chatMessage.priority,
          timestamp: chatMessage.timestamp,
          sender: chatMessage.sender,
          message: chatMessage.message
        };

        this.chatMessages.push(chatAnswer);
      }
      if (this.chatSubscription) {
        this.subscription.unsubscribe()
        this.connected = true;
      }
    })
  }

  ngOnDestroy(): void {
    this.unWatchSocjet()
  }

  watchSocket() {
    this.chatSubscription = this.socketService.watch('/topic/' + this.orgaID + '/' + this.eventID).subscribe((message: Message) => {
      const messageData = JSON.parse(message.body);
      const chatMessage: ChatAnswerModel = {
        sender: messageData.sender,
        message: messageData.message,
        priority: messageData.priority,
        timestamp: messageData.message
      };
      this.addChatMessage(chatMessage);
    });
  }

  addChatMessage(message: ChatAnswerModel) {
    this.chatMessages.push(message); // Fügt die neue Nachricht am Ende des Arrays an
    if (this.chatMessages.length > this.MAX_CHAT_MESSAGES) {
      this.chatMessages.shift(); // Entfernt die älteste Nachricht, wenn das Array die maximale Größe erreicht
    }
  }

  getUserEmail() : string {
    return this.storageService.getEmail()
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
      priority: false,
      message: chat
    }
    const message = JSON.stringify(model);
    this.socketService.publish({destination: '/app/events/chats', body: message});
  }

}
