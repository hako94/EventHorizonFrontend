import { RxStompConfig } from '@stomp/rx-stomp';

export const myRxStompConfig: RxStompConfig = {
  // Which server?
  brokerURL: 'ws://127.0.0.1:8080/ws',

  // Headers
  // Typical keys: login, passcode, host
  connectHeaders: {
    login: 'guest',
    passcode: 'guest',
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 500 (500 milli seconds)
  reconnectDelay: 200,

  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console
  debug: (msg: string): void => {
    console.log(new Date(), msg);
  },
  beforeConnect: () => {
    const headers: { [key: string]: string } = {};

    if (myRxStompConfig.connectHeaders) {
      Object.assign(headers, myRxStompConfig.connectHeaders);
    }

    const token = window.sessionStorage.getItem('auth-user');
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    myRxStompConfig.connectHeaders = headers;
  },
};
