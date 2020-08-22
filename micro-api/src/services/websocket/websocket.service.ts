import { UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { KeycloakService } from 'nestjs-keycloak-admin';
import { RedisClient } from '@nestjs/microservices/external/redis.interface';
import { promisify } from 'util';
import { ServerRepository } from 'src/repositories/server/server.repository';
import { MessageRepository } from 'src/repositories/message/message.repository';

interface RedisGet {
  (value: string): Promise<string>;
}

interface RedisSet {
  (key: string, value: string): Promise<string>;
}

@WebSocketGateway(0, {namespace: "channels"})
export class WebsocketService implements OnGatewayConnection {
  @WebSocketServer()
  server;

  constructor(
    private keycloakService: KeycloakService,
    private serverRepo: ServerRepository,
    private messageRepo: MessageRepository,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
     console.log(client.handshake.query);
    try {
      const result = await this.keycloakService.connect.grantManager.validateAccessToken(
        client.handshake.query.token,
      );
      console.log(result);
      if (!(typeof result === 'string')) {
        throw new UnauthorizedException();
      }
      const user: {
        sub: string;
      } = await this.keycloakService.connect.grantManager.userInfo(
        client.handshake.query.token,
      );
      const { redisSet } = WebsocketService.redisClient(client);
      await redisSet(client.id, user.sub);
    } catch (e) {
      client.disconnect(true);
      throw e;
    }
  }

  @SubscribeMessage('join')
  async onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channel_id: string, server_id: string },
  ): Promise<void> {
    const { channel_id, server_id } = data;
    //const server = await this.getServer(channel_id);
    //client.join(server.id);
    client.join(server_id);
    const { redisSet } = WebsocketService.redisClient(client);
    //await redisSet(client.id, JSON.stringify({ channel_id }));
    // const messages = await this.messageRepo.find({
    //   where: {
    //     //@ts-ignore
    //     has_parent: {
    //       parent_type: 'Channel',
    //       query: {
    //         match: {
    //           id: channel_id,
    //         },
    //       },
    //     },
    //   },
    //  // order: ['created_at ASC'],
    // });
    // client.emit('get-messages', messages);

    console.log('join', client.id);
  }

  @SubscribeMessage('send-message')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { content: string, channel_id: string},
  ): Promise<void> {
    const { channel_id, content } = data;
    //const server = await this.getServer(channel_id);
    //client.join(server.id);
    const { redisSet, redisGet } = WebsocketService.redisClient(client);
    const userId = await redisGet(client.id);
    const message = await this.messageRepo.create({
        content,
        user_id: userId,
        join: {name: "Message", parent: channel_id}
    });
    client.emit('new-message', {message});
    const server = await this.getServer(channel_id);
    client.broadcast.to(server.id)
    console.log('message sent');
  }

  private static redisClient(client) {
    const redisClient: RedisClient = client.adapter.pubClient;

    const redisGet: RedisGet = promisify(redisClient.get).bind(redisClient);

    const redisSet: RedisSet = promisify(redisClient.set).bind(redisClient);

    return { redisGet, redisSet };
  }

  private async getServer(channelId: string) {
    return this.serverRepo.findOne({
      where: {
        //@ts-ignore
        has_child: {
          type: 'Category',
          query: {
            has_child: {
              type: 'Channel',
              query: {
                match: {
                  id: channelId,
                },
              },
            },
          },
        },
      },
    });
  }
}
