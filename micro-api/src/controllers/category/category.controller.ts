import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CategoryDto } from 'src/dto/category.dto';
import { CategoryRepository } from 'src/repositories/category/category.repository';
import { Category } from 'src/models/category.model';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('servers/:server_id/categories')
export class CategoryController {
  constructor(private categoryRepo: CategoryRepository) {}

  @Get()
  index(@Param('server_id') serverId: string): Promise<Category> {
    //@ts-ignore
    return this.categoryRepo.find({
      where: {
        //@ts-ignore
        has_parent: {
          parent_type: 'Server',
          query: {
            match: {
              id: serverId,
            },
          },
        },
      },
    });
  }

  @Post()
  store(
    @Param('server_id') serverId: string,
    @Body() body: CategoryDto,
  ): Promise<Category> {
    return this.categoryRepo.create({
      ...body,
      join: {
        name: 'Category',
        parent: serverId,
      },
    });
  }

  @Get(':id')
  show(@Param('id') id: string): Promise<Category> {
    return this.categoryRepo.findOne({
      where: {
        id,
      },
    });
  }
}
