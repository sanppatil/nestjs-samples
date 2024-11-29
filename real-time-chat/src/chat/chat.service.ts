import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatRepository: Repository<ChatMessage>,
  ) {}

  async saveMessage(content: string, senderId: number): Promise<ChatMessage> {
    const message = this.chatRepository.create({
      content,
      sender: { id: senderId },
    });
    return this.chatRepository.save(message);
  }

  async getMessages(): Promise<ChatMessage[]> {
    return this.chatRepository.find({ relations: ['sender'] });
  }
}
