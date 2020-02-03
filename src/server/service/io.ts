import { Socket } from 'socket.io';

export interface IO {
  sendMsg<T>(msg: T): void;
  receiveMsg(): Promise<any[]>;
}

export class SocketIOService implements IO {
  constructor(private socket: Socket, private event: string) {}

  get id() {
    return this.socket.id;
  }

  sendMsg<T>(msg: T) {
    this.socket.emit(this.event, msg);
  }

  receiveMsg() {
    return new Promise<any[]>(res =>
      this.socket.on(this.event, (...data) => res(data))
    );
  }
}
