import { Injectable } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Redis } from 'ioredis';
interface IMessage {
  message: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer() server;
  private publisher: Redis;
  private subscriber: Redis;

  constructor() {
    this.publisher = new Redis({
      host: 'localhost',
      port: 6379,
    });
    this.subscriber = new Redis({
      host: 'localhost',
      port: 6379,
    });

    this.subscriber.subscribe('chat_messages');
    this.subscriber.on('message', (channel, message) => {
      if (channel === 'chat_messages') {
        console.log(channel, 'message');
        this.server.emit('message', JSON.parse(message));
      }
    });
  }

  @SubscribeMessage('send_message')
  async create(@MessageBody() data: IMessage) {
    await this.publisher.publish('chat_messages', JSON.stringify(data));
  }
}
