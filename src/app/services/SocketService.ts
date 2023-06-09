import {RxStomp} from "@stomp/rx-stomp";
import {Injectable} from "@angular/core";
import {myRxStompConfig} from "../my-rx-stomp.config";

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
    super();// hier dein Token einfügen
    this.configure({
      ...myRxStompConfig // füge andere Konfigurationen hinzu
    });
    this.activate();
  }
}
