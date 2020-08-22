import { Console, Command } from 'nestjs-console';
import { ModuleRef } from '@nestjs/core';
import { EsvDataSourceService } from '../../services/esv-data-source/esv-data-source.service';
//@ts-ignore
import { Client } from 'es7';
import fixtures from './json';
import { DefaultCrudRepository } from '@loopback/repository';
import chalk from 'chalk';
import { exec } from 'child_process';
import { MEDIA_DIR } from 'src/file';
@Console()
export class FixturesCommand {
  constructor(
    private moduleRef: ModuleRef,
    private dataSource: EsvDataSourceService,
  ) {}

  @Command({
    command: 'fixtures',
    description: 'Seed data in database',
  })
  async command(): Promise<void> {
    await this.deleteAllDocuments();
    exec(`rm -rf ${MEDIA_DIR}/*`);
    for (const fixture of fixtures) {
      if ('model' in fixture) {
        const repository = this.getRepository(
            //@ts-ignore
          fixture.model,
        ) as DefaultCrudRepository<any, any>;
        //@ts-ignore
        await repository.create(fixture.fields);
      } else {
        // @ts-ignore
        const [serviceClass, method] = fixture.fixture.split('@');
        const service = this.getService(serviceClass);
        await service[method](fixture.fields);
      }
    }

    console.log(chalk.green('Documents generated'));
  }

  async deleteAllDocuments(): Promise<void> {
    const connector = this.dataSource.adapter;
    const client: Client = this.dataSource.adapter.db;
    await client.deleteByQuery({
      index: connector.settings.index,
      body: {
        query: {
          match_all: {},
        },
      },
    });
  }

  getRepository<T>(name: string): T {
    return this.moduleRef.get(`${name}Repository`);
  }

  getService<T>(name: string): T {
    return this.moduleRef.get(name);
  }
}
