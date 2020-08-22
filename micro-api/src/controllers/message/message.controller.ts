import { Controller, Get, Param } from '@nestjs/common';
import { MessageRepository } from 'src/repositories/message/message.repository';
import { Message } from 'src/models/message.model';

@Controller('channels/:channel_id/messages')
export class MessageController {
  constructor(private messageRepo: MessageRepository) {}
  @Get()
  index(@Param('channel_id') channelId: string): Promise<Message> {
    //@ts-ignore
    return this.messageRepo.find({
      where: {
        //@ts-ignore
        has_parent: {
          parent_type: 'Channel',
          query: {
            match: {
              id: channelId,
            },
          },
        },
      },
    });
  }
}
