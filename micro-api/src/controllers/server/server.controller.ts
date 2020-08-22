import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UnprocessableEntityException,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ServerRepository } from 'src/repositories/server/server.repository';
import { Server } from 'src/models/server.model';
import { ServerDto } from 'src/dto/server.dto';
import { imageValidator } from 'src/validators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { hashFilename } from 'src/file';
import { AuthGuard, Public } from 'nestjs-keycloak-admin';
import { Request } from 'express';
import { User } from 'src/models/user.model';
import { UserRepository } from 'src/repositories/user/user.repository';

//@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('servers')
export class ServerController {
  constructor(
    private serverRepo: ServerRepository,
    private userRepo: UserRepository,
  ) {}

  @Get()
  index(@Req() request: {user: any}): Promise<Server[]> {
    const userId = request.user.sub;
    return this.serverRepo.find({
      where: {
        or: [{owner_id: userId}, {members_id: userId}]
      }
    });
  }

  @Get(':id')
  show(@Param('id') id: string): Promise<Server> {
    return this.serverRepo.findOne({
      fields: {
        members_id: false,
      },
      where: {
        id,
      },
    });
  }

  @UseInterceptors(
    FileInterceptor('logo', {
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: imageValidator,
      storage: diskStorage({
        destination: Server.LOGO_PATH,
        filename: hashFilename,
      }),
    }),
  )
  @Post()
  store(
    @Req() req: { user: any },
    @Body() body: ServerDto,
    @UploadedFile() logo: { filename: string },
  ): Promise<Server> {
    if (!logo) {
      throw new UnprocessableEntityException('Missing logo file');
    }
    console.log(req.user);
    return this.serverRepo.create({
      ...body,
      logo_file: logo.filename,
      owner_id: req.user.sub,
      members_id: [req.user.sub],
    });
  }

  @Get(':id/members')
  async members(@Param('id') id: string): Promise<User[]> {
    const server = await this.serverRepo.findOne({
      where: {
        id,
      },
    });
    console.log(server.members_id.map(mId => ({ id: mId })));
    return this.userRepo.find({
      where: {
        or: server.members_id.map(mId => ({ id: mId })),
      },
    });
  }

  @Post(':server_id/members/:member_id')
  @HttpCode(204)
  async addMember(@Param() params: {server_id: string, member_id: string}): Promise<void> {
    const server = await this.serverRepo.findOne({where: {id: params.server_id}});
    await this.serverRepo.updateById(params.server_id,{
        members_id: [...server.members_id, params.member_id]  
    });
  }
}
