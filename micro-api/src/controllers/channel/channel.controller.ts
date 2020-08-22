import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Get,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { ChannelRepository } from 'src/repositories/channel/channel.repository';
import { Channel } from 'src/models/channel.model';
import { ChannelDto } from 'src/dto/channel.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('categories/:category_id/channels')
export class ChannelController {
  constructor(private channelRepo: ChannelRepository) {}
  @Get()
  index(@Param('category_id') categoryId: string): Promise<Channel> {
    //@ts-ignore
    return this.channelRepo.find({
      where: {
        //@ts-ignore
        has_parent: {
          parent_type: 'Category',
          query: {
            match: {
              id: categoryId,
            },
          },
        },
      },
    });
  }


  @Post()
  store(
    @Param('category_id') categoryId: string,
    @Body() body: ChannelDto,
  ): Promise<Channel> {
    return this.channelRepo.create({
      ...body,
      join: {
        name: 'Channel',
        parent: categoryId,
      },
    });
  }

  @Get(':id')
  show(@Param('id') id: string): Promise<Channel> {
    return this.channelRepo.findOne({
      where: {
        id,
      },
    });
  }
}
