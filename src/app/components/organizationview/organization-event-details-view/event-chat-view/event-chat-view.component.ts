import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatModel} from "../../../../models/ChatModel";
import {ChatAnswerModel} from "../../../../models/ChatAnswerModel";
import {SocketService} from "../../../../services/SocketService";
import {DataService} from "../../../../services/DataService";
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
  @ViewChild('chatWindow') chatWindow!: any;
  @ViewChild('importantWindow') importantWindow!: any;
  @ViewChild('socketInput') socketInput!: any;

  chatSubscription?: Subscription;
  chatMessages: ChatAnswerModel[] = [];
  private readonly MAX_CHAT_MESSAGES = 50;

  subscription: Subscription;
  isImportant: boolean = false;
  selectedTabIndex: number = 0;

  constructor(private socketService: SocketService, private storageService: StorageService, private dataService: DataService) {
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
          username: chatMessage.username,
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
      let messageData = JSON.parse(message.body) as string;
      let jsonString = JSON.parse(messageData);

      const chatMessage: ChatAnswerModel = {
        sender: jsonString.sender,
        message: jsonString.message,
        username: jsonString.username,
        priority: jsonString.priority,
        timestamp: jsonString.timestamp
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


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      const chatWindow = document.querySelector('.chat-window');
      const importantWindow = document.querySelector('.important-window');
      if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
      if (importantWindow) {
        importantWindow.scrollTop = importantWindow.scrollHeight;
      }
    } catch (err) { }
  }
  getUserEmail() : string {
    return this.storageService.getEmail()
  }

  unWatchSocjet() {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe()
    }
  }

  getImportantMessages() {
    return this.chatMessages.filter(message => message.priority);
  }

  //DANGER ZONE
  pushMessageToBackend(chat: string, isImportant: boolean) {
    if (!chat.trim()) { // prüft, ob die Nachricht leer oder nur aus Leerzeichen besteht
      return; // beendet die Methode, wenn die Nachricht leer ist
    }

    const priority = isImportant || (this.selectedTabIndex === 1);
    const model: ChatModel = {
      orgId: this.orgaID,
      eventId: this.eventID,
      priority: priority,
      message: chat
    }
    const message = JSON.stringify(model);
    this.socketService.publish({destination: '/app/events/chats', body: message});

    this.socketInput.nativeElement.value = '';
    this.isImportant = false;
  }

}
