import {map, Observable, share, Subject, tap} from "rxjs";
import {RxStomp} from "@stomp/rx-stomp";
import {Injectable} from "@angular/core";
import {webSocket} from "rxjs/webSocket";
import {myRxStompConfig} from "../my-rx-stomp.config";
import {Message} from "@stomp/stompjs";

export function rxStompServiceFactory() {
  const rxStomp = new SocketService();
  rxStomp.configure(myRxStompConfig);
  rxStomp.activate();
  return rxStomp;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService extends RxStomp {

  constructor() {
    super();
  }
}
