import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { content: string; senderId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.saveMessage(
      data.content,
      data.senderId,
    );
    this.server.emit('newMessage', message);
  }

  async handleConnection(client: Socket) {
    const token = Array.isArray(client.handshake.query.token)
      ? client.handshake.query.token[0]
      : client.handshake.query.token;

    try {
      const decoded = this.jwtService.verify(token as string); // Ensure the token is a string
      client.data.user = decoded; // Store the user info in the client object
    } catch (e) {
      console.error('Authentication error:', e.message);
      client.disconnect(); // Disconnect the client if verification fails
    }
  }
}
