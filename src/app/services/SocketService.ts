import {map, Observable, share, Subject, tap} from "rxjs";
import {RxStomp} from "@stomp/rx-stomp";
import {Injectable} from "@angular/core";
import {webSocket} from "rxjs/webSocket";

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  constructor(private stomp: RxStomp) {
    const subject2 = webSocket('ws://localhost:8080/ws');

    subject2.subscribe({
      next: msg => console.log('message received: ' + msg), // Called whenever there is a message from the server.
      error: err => console.log('err' + err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
    });
  }

  connect() {
    this.send("test")
  }

  send(message: any) {
    this.stomp.publish({
      destination: '/app/message',
      body: JSON.stringify(message),
      headers: {'content-type': 'application/json'}
    });
  }
}
